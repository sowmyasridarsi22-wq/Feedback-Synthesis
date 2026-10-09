import Feedback from '../models/Feedback.js';
import Dataset from '../models/Dataset.js';
import { analyzeBatch, synthesize } from '../services/geminiService.js';
import { localAnalyze } from '../services/localAnalysisService.js';

const analyzedFilter = (datasetId, product) => ({
  datasetId,
  processingStatus: 'Analyzed',
  ...(product && product !== 'All Products' ? { product } : {})
});

const pct = (value, total) => total ? Math.round((value / total) * 100) : 0;

export async function analyze(req, res) {
  const { datasetId } = req.body;
  if (!datasetId) return res.status(400).json({ message: 'datasetId is required' });

  const rows = await Feedback.find({
    datasetId,
    processingStatus: { $in: ['Pending', 'Failed'] }
  }).select('_id originalFeedback sentiment category product date rating').lean();

  const size = Math.max(1, Number(process.env.BATCH_SIZE) || 25);
  let processed = 0;
  let failed = 0;
  let gemini = 0;
  let fallback = 0;

  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);

    try {
      const result = await analyzeBatch(batch.map(x => x.originalFeedback));

      for (let j = 0; j < batch.length; j++) {
        const a = result[j] || {};
        await Feedback.findByIdAndUpdate(batch[j]._id, {
          sentiment: a.sentiment || batch[j].sentiment || 'Neutral',
          sentimentScore: a.sentimentScore ?? null,
          category: a.category || batch[j].category || 'Other',
          topic: a.topic || 'General Feedback',
          subtopic: a.subtopic || null,
          issue: a.issue || null,
          severity: a.severity || 'Low',
          keywords: Array.isArray(a.keywords) ? a.keywords : [],
          featureRequest: Boolean(a.featureRequest),
          requestedFeature: a.requestedFeature || null,
          aiSummary: a.summary || batch[j].originalFeedback,
          processingStatus: 'Analyzed',
          analysisSource: 'gemini'
        });
      }
      gemini += batch.length;
    } catch (error) {
      // Keep the application usable even when Gemini is unavailable/rate-limited.
      for (const row of batch) {
        try {
          const a = localAnalyze(row);
          await Feedback.findByIdAndUpdate(row._id, {
            ...a,
            processingStatus: 'Analyzed',
            analysisSource: 'local-fallback'
          });
          fallback++;
        } catch {
          await Feedback.findByIdAndUpdate(row._id, { processingStatus: 'Failed' });
          failed++;
        }
      }
    }

    processed += batch.length;
  }

  await Dataset.findByIdAndUpdate(datasetId, {
    status: failed ? 'Partially Analyzed' : 'Analyzed'
  });

  return res.json({
    processed,
    failed,
    gemini,
    fallback,
    message: `Analysis complete. ${processed - failed} records analyzed.`
  });
}

export async function summary(req, res) {
  const { datasetId, product = 'All Products' } = req.query;
  if (!datasetId) return res.status(400).json({ message: 'datasetId is required' });

  const match = analyzedFilter(datasetId, product);

  const [total, positive, negative, neutral, topics, issues, features, rows, products] =
    await Promise.all([
      Feedback.countDocuments(match),
      Feedback.countDocuments({ ...match, sentiment: 'Positive' }),
      Feedback.countDocuments({ ...match, sentiment: 'Negative' }),
      Feedback.countDocuments({ ...match, sentiment: 'Neutral' }),
      Feedback.aggregate([
        { $match: match },
        { $group: { _id: '$topic', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Feedback.aggregate([
        { $match: { ...match, issue: { $nin: [null, ''] } } },
        { $group: { _id: '$issue', count: { $sum: 1 }, severity: { $first: '$severity' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Feedback.aggregate([
        { $match: { ...match, featureRequest: true, requestedFeature: { $nin: [null, ''] } } },
        { $group: { _id: '$requestedFeature', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Feedback.find(match).select('date sentiment topic product featureRequest issue rating').lean(),
      Feedback.aggregate([
        { $match: { datasetId, processingStatus: 'Analyzed', product: { $nin: [null, ''] } } },
        { $group: { _id: '$product', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 100 }
      ])
    ]);

  const byMonth = {};
  const sentimentByMonth = {};

  rows.forEach(row => {
    if (!row.date || Number.isNaN(new Date(row.date).getTime())) return;
    const key = new Date(row.date).toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] || 0) + 1;
    sentimentByMonth[key] ??= { Positive: 0, Neutral: 0, Negative: 0 };
    if (sentimentByMonth[key][row.sentiment] != null) sentimentByMonth[key][row.sentiment]++;
  });

  const trend = Object.keys(byMonth).sort().map(month => ({
    month,
    count: byMonth[month],
    positive: pct(sentimentByMonth[month]?.Positive || 0, byMonth[month]),
    negative: pct(sentimentByMonth[month]?.Negative || 0, byMonth[month]),
    neutral: pct(sentimentByMonth[month]?.Neutral || 0, byMonth[month])
  }));

  let ai = null;
  try {
    ai = await synthesize({ total, positive, negative, neutral, topics, issues, features, product: product === 'All Products' ? null : product });
  } catch {
    ai = null;
  }

  return res.json({
    stats: { total, positive, negative, neutral, topics, issues, features },
    trend,
    ai,
    products: products.map(x => x._id).filter(Boolean),
    selectedProduct: product
  });
}

export async function productTrend(req, res) {
  const { datasetId, product } = req.query;
  if (!datasetId || !product) return res.status(400).json({ message: 'datasetId and product are required' });

  const filter = analyzedFilter(datasetId, product);
  const rows = await Feedback.find(filter)
    .select('date sentiment featureRequest topic issue rating')
    .lean();

  const months = {};

  for (const row of rows) {
    if (!row.date || Number.isNaN(new Date(row.date).getTime())) continue;
    const month = new Date(row.date).toISOString().slice(0, 7);
    months[month] ??= {
      month,
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      featureRequests: 0,
      issues: 0,
      avgRating: 0,
      ratingCount: 0
    };

    const item = months[month];
    item.total++;
    if (row.sentiment === 'Positive') item.positive++;
    if (row.sentiment === 'Neutral') item.neutral++;
    if (row.sentiment === 'Negative') item.negative++;
    if (row.featureRequest) item.featureRequests++;
    if (row.issue) item.issues++;
    if (Number.isFinite(Number(row.rating))) {
      item.avgRating += Number(row.rating);
      item.ratingCount++;
    }
  }

  const trend = Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(item => ({
      ...item,
      positiveRate: pct(item.positive, item.total),
      negativeRate: pct(item.negative, item.total),
      avgRating: item.ratingCount ? Number((item.avgRating / item.ratingCount).toFixed(2)) : null
    }));

  const latest = trend.at(-1) || null;
  const previous = trend.at(-2) || null;
  const first = trend[0] || null;

  const percentageChange = (current, previousValue) => {
    if (!previousValue) return 0;
    return Math.round(((current - previousValue) / previousValue) * 100);
  };

  const recentChange = latest && previous
    ? percentageChange(latest.total, previous.total)
    : 0;

  const periodChange = latest && first
    ? percentageChange(latest.total, first.total)
    : 0;

  let demandSignal = 'Stable';
  if (recentChange >= 10) demandSignal = 'Increasing';
  if (recentChange <= -10) demandSignal = 'Decreasing';

  // Feedback volume is used as a demand/interest proxy, not as actual sales demand.
  const demandExplanation =
    demandSignal === 'Increasing'
      ? `Customer feedback volume for ${product} increased ${Math.abs(recentChange)}% in the latest month compared with the previous month. This indicates rising customer interest/engagement, but it is not a direct sales forecast.`
      : demandSignal === 'Decreasing'
        ? `Customer feedback volume for ${product} decreased ${Math.abs(recentChange)}% in the latest month compared with the previous month. This indicates lower customer feedback activity, but it is not proof that sales demand decreased.`
        : `Customer feedback volume for ${product} is relatively stable between the latest two months. This is a feedback-interest signal, not a direct sales-demand measurement.`;

  const topTopics = await Feedback.aggregate([
    { $match: filter },
    { $group: { _id: '$topic', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  const topIssues = await Feedback.aggregate([
    { $match: { ...filter, issue: { $nin: [null, ''] } } },
    { $group: { _id: '$issue', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  const topFeatures = await Feedback.aggregate([
    { $match: { ...filter, featureRequest: true, requestedFeature: { $nin: [null, ''] } } },
    { $group: { _id: '$requestedFeature', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  const positiveRate = latest?.total ? pct(latest.positive, latest.total) : 0;
  const negativeRate = latest?.total ? pct(latest.negative, latest.total) : 0;

  let confidence = 'Low';
  if (trend.length >= 4) confidence = 'Medium';
  if (trend.length >= 8) confidence = 'High';

  return res.json({
    product,
    trend,
    latest,
    previous,
    demandSignal,
    demandExplanation,
    recentChange,
    periodChange,
    positiveRate,
    negativeRate,
    confidence,
    topTopics,
    topIssues,
    topFeatures,
    total: rows.length
  });
}

export async function listFeedback(req, res) {
  const { datasetId, q, sentiment, topic, product, page = 1, limit = 20 } = req.query;
  const filter = { datasetId };
  if (product && product !== 'All Products') filter.product = product;
  if (sentiment) filter.sentiment = sentiment;
  if (topic) filter.topic = topic;
  if (q) filter.$or = [
    { originalFeedback: { $regex: q, $options: 'i' } },
    { topic: { $regex: q, $options: 'i' } },
    { issue: { $regex: q, $options: 'i' } },
    { product: { $regex: q, $options: 'i' } }
  ];

  const total = await Feedback.countDocuments(filter);
  const data = await Feedback.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  return res.json({ data, total, page: Number(page), pages: Math.ceil(total / limit) });
}

export async function insights(req, res) {
  const { datasetId, product = 'All Products' } = req.query;
  const filter = analyzedFilter(datasetId, product);
  const rows = await Feedback.find(filter).lean();
  const topicMap = {}, issueMap = {}, featureMap = {}, keywordMap = {};

  for (const row of rows) {
    if (row.topic) topicMap[row.topic] = (topicMap[row.topic] || 0) + 1;
    if (row.issue) issueMap[row.issue] = (issueMap[row.issue] || 0) + 1;
    if (row.requestedFeature) featureMap[row.requestedFeature] = (featureMap[row.requestedFeature] || 0) + 1;
    (row.keywords || []).forEach(keyword => {
      keywordMap[keyword] = (keywordMap[keyword] || 0) + 1;
    });
  }

  const top = map => Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count }));

  return res.json({
    topics: top(topicMap),
    issues: top(issueMap),
    features: top(featureMap),
    keywords: top(keywordMap)
  });
}

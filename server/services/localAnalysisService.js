const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "was",
  "are",
  "but",
  "have",
  "has",
  "had",
  "from",
  "your",
  "you",
  "they",
  "them",
  "their",
  "very",
  "too",
  "not",
  "can",
  "would",
  "could",
  "please",
  "app",
  "application",
  "product",
  "user",
  "users",
  "overall",
  "good",
  "great",
  "like",
  "want",
  "would",
  "make",
  "more",
  "really",
  "just",
  "also",
  "after",
  "before",
  "into",
  "about",
  "when",
  "where",
  "what",
  "there",
  "here",
  "our",
  "my",
  "i",
  "it",
  "is",
  "to",
  "of",
  "in",
  "on",
  "a",
  "an",
  "as",
  "at",
  "be",
  "or",
  "so",
  "if",
  "we",
  "me",
]);
const featurePatterns = [
  /add (?:a |an )?(.+)/i,
  /wish (?:the )?(?:app|application|website)? ?had (.+)/i,
  /would like (?:an |a )?(.+)/i,
  /need (?:an |a )?(.+)/i,
  /please (?:add|provide|include|support) (.+)/i,
  /option to (.+)/i,
];
function topic(text, category) {
  const s = text.toLowerCase();
  if (/slow|load|lag|freeze|performance|unresponsive/.test(s))
    return "Application Performance";
  if (/payment|charged|checkout|transaction/.test(s)) return "Payment";
  if (/delivery|shipment|arrive|late/.test(s)) return "Delivery";
  if (/login|sign in|password|account/.test(s)) return "Account & Login";
  if (/support|agent|response/.test(s)) return "Customer Support";
  if (/refund|return/.test(s)) return "Returns & Refunds";
  if (/search|filter/.test(s)) return "Search";
  if (/price|pricing|discount|cost/.test(s)) return "Pricing";
  if (/dark mode|wishlist|export|biometric|feature|add /.test(s))
    return "Feature Request";
  if (/quality|broken|defect/.test(s)) return "Product Quality";
  if (/interface|design|checkout process|easy to use|confusing/.test(s))
    return "User Experience";
  return category || "General Feedback";
}
function keywords(text) {
  return [
    ...new Set(
      (text.toLowerCase().match(/[a-z][a-z-]{2,}/g) || []).filter(
        (x) => !STOP.has(x),
      ),
    ),
  ].slice(0, 8);
}
function feature(text) {
  for (const p of featurePatterns) {
    const m = text.match(p);
    if (m)
      return m[1]
        .replace(/[.!?].*$/, "")
        .trim()
        .slice(0, 80);
  }
  return null;
}
export function localAnalyze(row) {
  const text = row.originalFeedback || "";
  const s = text.toLowerCase();
  let sentiment = row.sentiment;
  if (!["Positive", "Negative", "Neutral"].includes(sentiment)) {
    sentiment =
      /slow|fail|failed|problem|issue|crash|late|delay|confusing|cannot|can't|poor|bad|broken|error|longer/.test(
        s,
      )
        ? "Negative"
        : /excellent|great|happy|good|love|easy|useful|fast|earlier/.test(s)
          ? "Positive"
          : "Neutral";
  }
  const requested = feature(text);
  const issue = sentiment === "Negative" ? topic(text, row.category) : null;
  const severity =
    /crash|charged|cannot|can't|failed|failure|critical|broken/.test(s)
      ? "High"
      : sentiment === "Negative"
        ? "Medium"
        : "Low";
  return {
    sentiment,
    sentimentScore:
      sentiment === "Positive" ? 80 : sentiment === "Negative" ? 78 : 55,
    category: row.category || "Other",
    topic: topic(text, row.category),
    subtopic: null,
    issue,
    keywords: keywords(text),
    featureRequest: Boolean(requested),
    requestedFeature: requested,
    severity,
    aiSummary: text.length > 140 ? text.slice(0, 137) + "..." : text,
    analysisSource: "local-fallback",
  };
}

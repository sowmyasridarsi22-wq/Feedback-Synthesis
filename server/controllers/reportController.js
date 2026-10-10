import PDFDocument from "pdfkit";
import Feedback from "../models/Feedback.js";
export async function exportCSV(req, res) {
  const { datasetId } = req.query;
  const rows = await Feedback.find({ datasetId }).lean();
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const head = [
    "Feedback",
    "Date",
    "Rating",
    "Sentiment",
    "Category",
    "Topic",
    "Issue",
    "Severity",
    "Feature Request",
    "Requested Feature",
    "Keywords",
    "AI Summary",
  ];
  const lines = [head.join(",")];
  rows.forEach((r) =>
    lines.push(
      [
        r.originalFeedback,
        r.date,
        r.rating,
        r.sentiment,
        r.category,
        r.topic,
        r.issue,
        r.severity,
        r.featureRequest,
        r.requestedFeature,
        (r.keywords || []).join("; "),
        r.aiSummary,
      ]
        .map(esc)
        .join(","),
    ),
  );
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=feedback-analysis.csv",
  );
  res.send(lines.join("\n"));
}
export async function exportPDF(req, res) {
  const { datasetId } = req.query;
  const rows = await Feedback.find({ datasetId, processingStatus: "Analyzed" })
    .limit(200)
    .lean();
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=feedback-report.pdf",
  );
  doc.pipe(res);
  doc.fontSize(20).text("AI-Based User Feedback Synthesis Report");
  doc.moveDown();
  doc.fontSize(10).text(`Analyzed records: ${rows.length}`);
  doc.moveDown();
  rows.slice(0, 50).forEach((r, i) => {
    doc
      .fontSize(11)
      .text(
        `${i + 1}. ${r.topic || "Uncategorized"} — ${r.sentiment || "Unknown"}`,
      );
    doc
      .fontSize(9)
      .text(r.aiSummary || r.originalFeedback)
      .moveDown(0.5);
  });
  doc.end();
}

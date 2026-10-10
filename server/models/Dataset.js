import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: String,
    rows: Number,
    columns: [String],
    feedbackColumn: String,
    dateColumn: String,
    ratingColumn: String,
    sentimentColumn: String,
    productColumn: String,
    categoryColumn: String,
    sourceColumn: String,
    quality: mongoose.Schema.Types.Mixed,
    status: { type: String, default: "Imported" },
  },
  { timestamps: true },
);
export default mongoose.model("Dataset", schema);

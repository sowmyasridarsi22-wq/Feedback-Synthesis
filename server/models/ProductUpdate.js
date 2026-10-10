import mongoose from "mongoose";
const schema = new mongoose.Schema(
  { name: String, date: Date, datasetId: String, notes: String },
  { timestamps: true },
);
export default mongoose.model("ProductUpdate", schema);

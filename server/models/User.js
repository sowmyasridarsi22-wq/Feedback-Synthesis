import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Product Manager", "Business Analyst", "Support Manager"],
      default: "Product Manager",
    },
  },
  { timestamps: true },
);
export default mongoose.model("User", schema);

import { Router } from "express";
import {
  analyze,
  summary,
  listFeedback,
  insights,
  productTrend,
} from "../controllers/analysisController.js";
const r = Router();
r.post("/analyze", analyze);
r.get("/summary", summary);
r.get("/product-trend", productTrend);
r.get("/feedback", listFeedback);
r.get("/insights", insights);
export default r;

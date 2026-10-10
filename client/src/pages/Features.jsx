import { useEffect, useState } from "react";
import api from "../services/api";
export default function Features() {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true),
    [product, setProduct] = useState("All Products"),
    [products, setProducts] = useState([]);
  const id = localStorage.getItem("datasetId");
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    api
      .get("/summary", { params: { datasetId: id } })
      .then((r) => setProducts(r.data.products || []));
    api
      .get("/insights", { params: { datasetId: id, product } })
      .then((r) => setData(r.data.features || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (id)
      api
        .get("/insights", { params: { datasetId: id, product } })
        .then((r) => setData(r.data.features || []))
        .catch(() => {});
  }, [product]);
  return (
    <div>
      <h2 className="text-3xl font-bold">Feature Requests</h2>
      <p className="text-slate-400 mt-2">
        Identify and prioritize frequently requested improvements.
      </p>
      <section className="glass rounded-2xl p-5 mt-6 max-w-md">
        <label className="text-sm text-slate-400">Product</label>
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
        >
          <option>All Products</option>
          {products.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </section>
      <section className="glass rounded-2xl p-5 mt-7">
        {!id ? (
          <Empty />
        ) : loading ? (
          <p className="text-slate-400">Loading feature requests...</p>
        ) : data.length ? (
          data.map((x, i) => (
            <div
              key={i}
              className="py-4 border-b border-slate-800 last:border-0 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{x.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Detected from analyzed feedback
                </div>
              </div>
              <div className="text-cyan-300 font-bold">{x.count}</div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </section>
    </div>
  );
}
function Empty() {
  return (
    <p className="text-sm text-slate-500">
      No feature requests found yet. Run Gemini Analysis from Data Import.
    </p>
  );
}

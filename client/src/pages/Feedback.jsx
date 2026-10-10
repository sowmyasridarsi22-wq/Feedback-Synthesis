import { useEffect, useState } from "react";
import api from "../services/api";
export default function Feedback() {
  const [data, setData] = useState([]),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0);
  const id = localStorage.getItem("datasetId");
  useEffect(() => {
    if (id)
      api
        .get("/feedback", { params: { datasetId: id, q, page, limit: 25 } })
        .then((r) => {
          setData(r.data.data);
          setTotal(r.data.pages);
        });
  }, [id, q, page]);
  return (
    <div>
      <h2 className="text-3xl font-bold">Feedback Explorer</h2>
      <div className="glass rounded-2xl p-4 mt-6">
        <input
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
          placeholder="Search feedback, topics or issues..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <div className="overflow-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-left">
                <th className="p-3">Feedback</th>
                <th>Sentiment</th>
                <th>Topic</th>
                <th>Issue</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr className="border-t border-slate-800" key={r._id}>
                  <td className="p-3 max-w-md truncate">
                    {r.originalFeedback}
                  </td>
                  <td>{r.sentiment || "—"}</td>
                  <td>{r.topic || "—"}</td>
                  <td>{r.issue || "—"}</td>
                  <td>{r.severity || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 mt-4">
          {Array.from({ length: Math.min(total, 8) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${page === i + 1 ? "bg-cyan-500 text-slate-950" : "bg-slate-800"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

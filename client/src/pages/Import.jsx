import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Import() {
  const [file, setFile] = useState(null),
    [data, setData] = useState(null),
    [loading, setLoading] = useState(false),
    [msg, setMsg] = useState("");
  const nav = useNavigate();
  async function upload() {
    if (!file) return;
    setLoading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/upload", fd);
      setData(r.data);
      setMsg("Dataset imported successfully.");
      localStorage.setItem("datasetId", r.data.dataset._id);
    } catch (e) {
      setMsg(e.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }
  async function analyze() {
    setLoading(true);
    try {
      await api.post("/analyze", { datasetId: data.dataset._id });
      nav("/");
    } catch (e) {
      setMsg(e.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h2 className="text-3xl font-bold">Data Import</h2>
      <p className="text-slate-400 mt-2">
        Upload your real CSV. The system detects the schema automatically.
      </p>
      <div className="glass rounded-2xl p-6 mt-7 max-w-4xl">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="w-full border border-dashed border-slate-600 rounded-xl p-8 bg-slate-900/50"
        />
        <button
          disabled={!file || loading}
          onClick={upload}
          className="mt-4 bg-cyan-500 text-slate-950 font-bold px-5 py-3 rounded-xl disabled:opacity-40"
        >
          {loading ? "Processing..." : "Upload & Inspect"}
        </button>
        {msg && <p className="mt-4 text-sm text-slate-300">{msg}</p>}
      </div>
      {data && (
        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 lg:col-span-1">
            <h3 className="font-semibold">Detected columns</h3>
            {Object.entries(data.detected).map(([k, v]) => (
              <div
                className="flex justify-between border-b border-slate-800 py-2 text-sm"
                key={k}
              >
                <span className="text-slate-500">{k}</span>
                <span>{v || "Not found"}</span>
              </div>
            ))}
            <button
              onClick={analyze}
              disabled={loading}
              className="w-full mt-5 bg-white text-slate-950 font-semibold rounded-xl py-3"
            >
              {loading ? "Analyzing..." : "Run Gemini Analysis"}
            </button>
          </div>
          <div className="glass rounded-2xl p-5 lg:col-span-2 overflow-auto">
            <h3 className="font-semibold mb-3">Preview</h3>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {data.dataset.columns.slice(0, 8).map((c) => (
                    <th className="text-left p-2 text-slate-500" key={c}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.preview.map((r, i) => (
                  <tr key={i} className="border-t border-slate-800">
                    {data.dataset.columns.slice(0, 8).map((c) => (
                      <td className="p-2 max-w-[220px] truncate" key={c}>
                        {r[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function Trends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState('All Products');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [pt, setPt] = useState(null);
  const [ptLoading, setPtLoading] = useState(false);

  const id = localStorage.getItem('datasetId');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    api.get('/summary', {
      params: { datasetId: id, product: 'All Products' }
    })
      .then(r => {
        setData(r.data);
        setProducts(r.data.products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = useMemo(
    () => products.filter(p =>
      p.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

  useEffect(() => {
    if (!id || product === 'All Products') {
      setPt(null);
      return;
    }

    setPtLoading(true);

    api.get('/product-trend', {
      params: { datasetId: id, product }
    })
      .then(r => setPt(r.data))
      .catch(() => setPt(null))
      .finally(() => setPtLoading(false));
  }, [id, product]);

  if (!id) {
    return (
      <Empty text="Upload and analyze a dataset first to see product trends." />
    );
  }

  if (loading) {
    return <p className="text-slate-400">Loading product trends...</p>;
  }

  const trend = data?.trend || [];
  const selected = product !== 'All Products' ? pt : null;

  return (
    <div>
      <h2 className="text-3xl font-bold">
        Product Trends &amp; Demand Signals
      </h2>

      <p className="text-slate-400 mt-2">
        Search a specific product to understand feedback growth,
        customer sentiment, issues and feature demand.
      </p>

      <section className="glass rounded-2xl p-5 mt-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <div>
            <label className="text-sm text-slate-400">
              Search product
            </label>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product name..."
              className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

            {search && (
              <div className="text-xs text-slate-500 mt-2">
                {filtered.length} matching product(s)
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Analyze product
            </label>

            <select
              value={product}
              onChange={e => setProduct(e.target.value)}
              className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
            >
              <option>All Products</option>
              {filtered.map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {product === 'All Products' && (
          <p className="text-sm text-slate-500 mt-5">
            Select a product to get a product-specific demand signal
            and current trend analysis.
          </p>
        )}

        {ptLoading && (
          <p className="text-slate-500 mt-5">
            Analyzing {product} trend...
          </p>
        )}

        {selected && !ptLoading && (
          <>
            {/* Lavender metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
              <Signal
                title="Demand signal"
                value={selected.demandSignal}
                tone={
                  selected.demandSignal === 'Increasing'
                    ? 'increasing'
                    : selected.demandSignal === 'Decreasing'
                      ? 'decreasing'
                      : 'stable'
                }
              />

              <Signal
                title="Latest month"
                value={selected.latest?.total ?? 0}
              />

              <Signal
                title="Recent change"
                value={`${selected.recentChange >= 0 ? '+' : ''}${selected.recentChange}%`}
              />

              <Signal
                title="Period change"
                value={`${selected.periodChange >= 0 ? '+' : ''}${selected.periodChange}%`}
              />

              <Signal
                title="Positive feedback"
                value={`${selected.positiveRate}%`}
              />

              <Signal
                title="Negative feedback"
                value={`${selected.negativeRate}%`}
              />
            </div>

            {/* Lavender explanation panel */}
            <div className="product-trend-explanation mt-4 rounded-xl border p-4">
              <div className="font-semibold text-black">
                What this means
              </div>

              <p className="text-sm mt-2 leading-6">
                {selected.demandExplanation}
              </p>

              <p className="text-xs mt-2">
                Confidence: {selected.confidence}. Demand here is a
                feedback-interest proxy, not actual sales demand.
              </p>
            </div>
          </>
        )}
      </section>

      {product === 'All Products' && (
        <div className="grid lg:grid-cols-2 gap-5 mt-6">
          <Chart title="Overall feedback volume" data={trend} type="line" />
          <Chart title="Monthly feedback" data={trend} type="bar" />
        </div>
      )}

      {selected && (
        <>
          <section className="glass rounded-2xl p-5 mt-6">
            <h3 className="font-semibold mb-1">
              {product} — current trend
            </h3>

            <p className="text-sm text-slate-400 mb-4">
              Feedback volume is used as the demand/interest proxy.
              If the latest period has more feedback than the previous
              period, the signal is marked Increasing.
            </p>

            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={selected.trend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E9E1F5"
                  />
                  <XAxis dataKey="month" stroke="#777087" />
                  <YAxis stroke="#777087" />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Feedback volume"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                  />

                  <Line
                    type="monotone"
                    dataKey="featureRequests"
                    name="Feature requests"
                    stroke="#A78BFA"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    dataKey="issues"
                    name="Reported issues"
                    stroke="#FB7185"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-5 mt-6">
            <ListChart title="Top topics" rows={selected.topTopics} />
            <ListChart title="Top recurring issues" rows={selected.topIssues} />
            <ListChart title="Top feature requests" rows={selected.topFeatures} />
          </div>
        </>
      )}
    </div>
  );
}

function Signal({ title, value, tone = '' }) {
  return (
    <div className="product-trend-signal rounded-xl border p-4">
      <div className="text-xs text-[#514568]">
        {title}
      </div>

      <div
        className={`text-xl font-bold mt-2 ${
          tone === 'increasing'
            ? 'trend-increasing'
            : tone === 'decreasing'
              ? 'trend-decreasing'
              : tone === 'stable'
                ? 'trend-stable'
                : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Chart({ title, data, type }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="h-72">
        <ResponsiveContainer>
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9E1F5" />
              <XAxis dataKey="month" stroke="#777087" />
              <YAxis stroke="#777087" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={3}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9E1F5" />
              <XAxis dataKey="month" stroke="#777087" />
              <YAxis stroke="#777087" />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#A78BFA"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ListChart({ title, rows }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="font-semibold mb-4">{title}</h3>

      {rows?.length ? (
        rows.map((x, i) => (
          <div
            key={i}
            className="flex justify-between py-3 border-b border-slate-200"
          >
            <span>{x._id}</span>
            <span className="text-violet-600 font-semibold">
              {x.count}
            </span>
          </div>
        ))
      ) : (
        <p className="text-slate-500">No analyzed data.</p>
      )}
    </section>
  );
}

function Empty({ text }) {
  return (
    <div>
      <h2 className="text-3xl font-bold">Product Trends</h2>
      <div className="glass rounded-2xl p-7 mt-7 text-slate-400">
        {text}
      </div>
    </div>
  );
}

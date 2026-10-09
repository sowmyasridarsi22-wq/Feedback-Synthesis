import {useEffect,useState} from 'react';
import api from '../services/api';
import KPI from '../components/KPI';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export default function Dashboard(){

  const [s,setS]=useState(null),
        [i,setI]=useState(null),
        [loading,setLoading]=useState(true);

  const id=localStorage.getItem('datasetId');

  useEffect(()=>{
    if(!id){
      setLoading(false);
      return;
    }

    Promise.all([
      api.get('/summary',{params:{datasetId:id}}),
      api.get('/insights',{params:{datasetId:id}})
    ])
    .then(([a,b])=>{
      setS(a.data);
      setI(b.data);
    })
    .catch(()=>{})
    .finally(()=>setLoading(false));

  },[id]);

  if(!id)
    return (
      <div>
        <h2 className="text-3xl font-bold">
          Feedback Intelligence Dashboard
        </h2>

        <div className="glass rounded-2xl p-8 mt-7">
          <p className="text-slate-300">
            No dataset loaded yet.
          </p>

          <p className="text-slate-500 mt-2">
            Go to Data Import and upload your CSV to begin.
          </p>
        </div>
      </div>
    );

  if(loading||!s)
    return (
      <div className="text-slate-400">
        Loading analytics...
      </div>
    );

  const t=s.stats;

  const pie=[
    {name:'Positive',value:t.positive},
    {name:'Neutral',value:t.neutral},
    {name:'Negative',value:t.negative}
  ];

  return (
    <div>

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-3xl font-bold">
            Feedback Intelligence
          </h2>

          <p className="text-slate-400 mt-2">
            A synthesized view of what customers are saying.
          </p>
        </div>

        <button
          onClick={()=>location.reload()}
          className="border border-slate-700 rounded-xl px-4 py-2 text-sm"
        >
          Refresh
        </button>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">

        <KPI
          label="Total Feedback"
          value={t.total}
        />

        <KPI
          label="Positive"
          value={`${t.total?Math.round(t.positive/t.total*100):0}%`}
        />

        <KPI
          label="Neutral"
          value={`${t.total?Math.round(t.neutral/t.total*100):0}%`}
        />

        <KPI
          label="Negative"
          value={`${t.total?Math.round(t.negative/t.total*100):0}%`}
        />

      </div>


      {/* SENTIMENT + TOPICS */}

      <div className="grid lg:grid-cols-2 gap-5 mt-5">

        <section className="glass rounded-2xl p-5">

          <h3 className="font-semibold mb-4">
            Sentiment Distribution
          </h3>

          <div className="h-72">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                >

                  {pie.map((x,n)=>(
                    <Cell
                      key={n}
                      fill={[
                        '#22c55e',
                        '#94a3b8',
                        '#ef4444'
                      ][n]}
                    />
                  ))}

                </Pie>

                <Tooltip/>

              </PieChart>

            </ResponsiveContainer>

          </div>

        </section>


        <section className="glass rounded-2xl p-5">

          <h3 className="font-semibold mb-4">
            Top Topics
          </h3>

          <div className="h-72">

            <ResponsiveContainer>

              <BarChart
                data={t.topics||[]}
                layout="vertical"
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  type="number"
                  stroke="#64748b"
                />

                <YAxis
                  dataKey="_id"
                  type="category"
                  width={120}
                  stroke="#64748b"
                />

                <Tooltip/>

                <Bar
                  dataKey="count"
                  fill="#22d3ee"
                  radius={[0,5,5,0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

      </div>


      {/* FEEDBACK TREND */}

      <div className="grid lg:grid-cols-1 gap-5 mt-5">

        <section className="glass rounded-2xl p-5">

          <h3 className="font-semibold mb-4">
            Feedback Volume Over Time
          </h3>

          <div className="h-64">

            <ResponsiveContainer>

              <LineChart data={s.trend}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                />

                <YAxis
                  stroke="#64748b"
                />

                <Tooltip/>

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {!s.trend.length&&(
            <p className="text-sm text-slate-500">
              No usable date column was found for trend analysis.
            </p>
          )}

        </section>

      </div>


      {/* ISSUES / FEATURES / KEYWORDS */}

      <div className="grid lg:grid-cols-3 gap-5 mt-5">

        <List
          title="Recurring Issues"
          data={(i?.issues||[]).map(
            x=>`${x.name} — ${x.count}`
          )}
        />

        <List
          title="Feature Requests"
          data={(i?.features||[]).map(
            x=>`${x.name} — ${x.count}`
          )}
        />

        <List
          title="Keywords"
          data={(i?.keywords||[]).map(
            x=>`${x.name} — ${x.count}`
          )}
        />

      </div>

    </div>
  );
}


function List({title,data}){

  return (

    <section className="glass rounded-2xl p-5">

      <h3 className="font-semibold mb-4">
        {title}
      </h3>

      {data.length
        ? data.slice(0,8).map((x,n)=>(
            <div
              className="py-2 border-b border-slate-800 text-sm"
              key={n}
            >
              {x}
            </div>
          ))
        : (
          <p className="text-sm text-slate-500">
            No analyzed data yet.
          </p>
        )
      }

    </section>

  );
}
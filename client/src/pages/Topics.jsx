import {useEffect,useState} from 'react';
import api from '../services/api';

export default function Topics(){
  const [data,setData]=useState({topics:[],issues:[]}); const [product,setProduct]=useState('All Products'); const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  const id=localStorage.getItem('datasetId');
  useEffect(()=>{
    if(!id){setLoading(false);return}
    api.get('/summary',{params:{datasetId:id}}).then(r=>setProducts(r.data.products||[])); api.get('/insights',{params:{datasetId:id,product}}).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[id]);
  useEffect(()=>{if(id) api.get('/insights',{params:{datasetId:id,product}}).then(r=>setData(r.data)).catch(()=>{});},[product]);
  if(!id) return <Empty text="Upload and analyze a dataset first to see live topics and recurring issues."/>;
  if(loading) return <p className="text-slate-400">Loading topics and issues...</p>;
  return <div>
    <h2 className="text-3xl font-bold">Topics & Issues</h2>
    <p className="text-slate-400 mt-2">Explore normalized topics and recurring customer problems from your analyzed feedback.</p>
    <div className="glass rounded-2xl p-4 mt-6 max-w-md"><label className="text-sm text-slate-400">Product</label><select value={product} onChange={e=>setProduct(e.target.value)} className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"><option>All Products</option>{products.map(p=><option key={p}>{p}</option>)}</select></div><div className="grid lg:grid-cols-2 gap-5 mt-7">
      <Panel title="Top Topics">
        {data.topics?.length ? data.topics.map((x,i)=><Row key={i} name={x.name} count={x.count}/>) : <NoData/>}
      </Panel>
      <Panel title="Recurring Issues">
        {data.issues?.length ? data.issues.map((x,i)=><Row key={i} name={x.name} count={x.count}/>) : <NoData/>}
      </Panel>
    </div>
  </div>
}
function Panel({title,children}){return <section className="glass rounded-2xl p-5"><h3 className="font-semibold mb-4">{title}</h3>{children}</section>}
function Row({name,count}){return <div className="py-3 border-b border-slate-800 last:border-0 flex justify-between gap-4"><span>{name}</span><span className="text-cyan-300 font-semibold">{count}</span></div>}
function NoData(){return <p className="text-sm text-slate-500">No analyzed data yet. Run Gemini Analysis from Data Import.</p>}
function Empty({text}){return <div><h2 className="text-3xl font-bold">Topics & Issues</h2><div className="glass rounded-2xl p-7 mt-7 text-slate-400">{text}</div></div>}

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const barColor = v => v<=5?'#4dffc8':v<=8?'#ffb84d':'#ff5f5f';
const TT = ({active,payload,label}) => !active||!payload?.length ? null : (
  <div style={{background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:8,padding:'10px 14px',fontSize:13}}>
    <div style={{color:'var(--text-muted)',marginBottom:4}}>Year {label}</div>
    <div style={{color:'#6eb4ff',fontFamily:'var(--font-mono)',fontWeight:600}}>{payload[0]?.value}%</div>
  </div>
);

export default function UnemploymentChart({ data = [] }) {
  const chartData = data.map((v,i) => ({year:`Y${i+1}`,u:v}));
  const v0 = data[0];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div className="section-label" style={{margin:0}}>Unemployment</div>
          <div style={{fontSize:11,color:'var(--text-muted)'}}>Green ≤5% · Amber ≤8% · Red above</div>
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:600,color:barColor(v0||0)}}>
          {v0!==undefined?`${v0}%`:'—'}
          <span style={{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-body)',marginLeft:4}}>yr1</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{top:5,right:5,bottom:0,left:-20}}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="year" tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <Tooltip content={<TT/>} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
          <Bar dataKey="u" radius={[4,4,0,0]} animationDuration={600}>
            {chartData.map((e,i) => <Cell key={i} fill={barColor(e.u)} fillOpacity={0.85}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

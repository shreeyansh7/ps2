import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TT = ({active,payload,label}) => !active||!payload?.length ? null : (
  <div style={{background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:8,padding:'10px 14px',fontSize:13}}>
    <div style={{color:'var(--text-muted)',marginBottom:4}}>Year {label}</div>
    <div style={{color:'#ff8c42',fontFamily:'var(--font-mono)',fontWeight:600}}>Index: {payload[0]?.value}</div>
  </div>
);

export default function PovertyChart({ data = [] }) {
  const chartData = data.map((v,i) => ({year:`Y${i+1}`,pov:v}));
  const trend = data.length>=2 ? data[4]-data[0] : 0;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div className="section-label" style={{margin:0}}>Poverty Index</div>
          <div style={{fontSize:11,color:'var(--text-muted)'}}>0–100 (lower is better)</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:600,color:'#ff8c42'}}>{data[0]?.toFixed(1)||'—'}</div>
          {trend!==0&&<div style={{fontSize:11,color:trend<0?'#4dffc8':'#ff5f5f',fontFamily:'var(--font-mono)'}}>{trend<0?'▼':'▲'} {Math.abs(trend).toFixed(1)} by yr5</div>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{top:5,right:5,bottom:0,left:-20}}>
          <defs>
            <linearGradient id="povGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.18}/>
              <stop offset="95%" stopColor="#ff8c42" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
          <XAxis dataKey="year" tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <Tooltip content={<TT/>}/>
          <Area type="monotone" dataKey="pov" stroke="#ff8c42" strokeWidth={2} fill="url(#povGrad)" dot={{fill:'#ff8c42',r:3,strokeWidth:0}} animationDuration={600}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

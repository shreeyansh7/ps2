import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TT = ({active,payload,label}) => !active||!payload?.length ? null : (
  <div style={{background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:8,padding:'10px 14px',fontSize:13}}>
    <div style={{color:'var(--text-muted)',marginBottom:4}}>Year {label}</div>
    <div style={{color:'#c8ff6e',fontFamily:'var(--font-mono)',fontWeight:600}}>{payload[0]?.value>=0?'+':''}{payload[0]?.value}%</div>
  </div>
);

export default function GDPChart({ data = [] }) {
  const chartData = data.map((v,i) => ({year:`Y${i+1}`,gdp:v}));
  const yr5 = data[4];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div className="section-label" style={{margin:0}}>GDP Growth Rate</div>
          <div style={{fontSize:11,color:'var(--text-muted)'}}>5-year projection (%)</div>
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:600,color:'#c8ff6e'}}>
          {yr5!==undefined?`${yr5>=0?'+':''}${yr5}%`:'—'}
          <span style={{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-body)',marginLeft:4}}>yr5</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{top:5,right:5,bottom:0,left:-20}}>
          <defs>
            <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c8ff6e" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#c8ff6e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
          <XAxis dataKey="year" tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <Tooltip content={<TT/>}/>
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4"/>
          <Area type="monotone" dataKey="gdp" stroke="#c8ff6e" strokeWidth={2} fill="url(#gdpGrad)" dot={{fill:'#c8ff6e',r:3,strokeWidth:0}} activeDot={{r:5}} animationDuration={600}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

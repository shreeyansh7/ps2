import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TT = ({active,payload,label}) => !active||!payload?.length ? null : (
  <div style={{background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:8,padding:'10px 14px',fontSize:13}}>
    <div style={{color:'var(--text-muted)',marginBottom:4}}>Year {label}</div>
    <div style={{color:'#ffb84d',fontFamily:'var(--font-mono)',fontWeight:600}}>{payload[0]?.value}%</div>
  </div>
);

export default function InflationChart({ data = [] }) {
  const chartData = data.map((v,i) => ({year:`Y${i+1}`,inf:v}));
  const v0 = data[0]; const color = v0>8?'#ff5f5f':v0>4?'#ffb84d':'#4dffc8';
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div className="section-label" style={{margin:0}}>Inflation Rate</div>
          <div style={{fontSize:11,color:'var(--text-muted)'}}>Danger threshold at 4%</div>
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:600,color}}>
          {v0!==undefined?`${v0}%`:'—'}
          <span style={{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-body)',marginLeft:4}}>yr1</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{top:5,right:5,bottom:0,left:-20}}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
          <XAxis dataKey="year" tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
          <Tooltip content={<TT/>}/>
          <ReferenceLine y={4} stroke="#ff5f5f" strokeDasharray="4 4" strokeOpacity={0.6} label={{value:'Danger',fill:'#ff5f5f',fontSize:10,position:'right'}}/>
          <Line type="monotone" dataKey="inf" stroke="#ffb84d" strokeWidth={2} dot={{fill:'#ffb84d',r:3,strokeWidth:0}} activeDot={{r:5}} animationDuration={600}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

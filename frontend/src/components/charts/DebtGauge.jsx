import React from 'react';

export default function DebtGauge({ data = [] }) {
  const value = data[0] || 0;
  const max = 150;
  const pct = Math.min(value/max, 1);
  const color = value<60?'#4dffc8':value<90?'#ffb84d':'#ff5f5f';
  const label = value<60?'Sustainable':value<90?'Elevated':'Critical';

  const r=70, cx=90, cy=92;
  const toXY = (angle) => ({ x: cx + r*Math.cos(angle), y: cy + r*Math.sin(angle) });
  const startA = Math.PI;
  const endA   = 0;
  const curA   = startA + (endA - startA) * pct;
  const s = toXY(startA), e = toXY(endA), c = toXY(curA);

  const trackPath = `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
  const fillPath  = `M ${s.x} ${s.y} A ${r} ${r} 0 ${pct>0.5?1:0} 1 ${c.x} ${c.y}`;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div className="section-label" style={{margin:0}}>Public Debt</div>
          <div style={{fontSize:11,color:'var(--text-muted)'}}>% of GDP</div>
        </div>
        <div style={{fontSize:12,fontWeight:600,color}}>{label}</div>
      </div>
      <div style={{display:'flex',justifyContent:'center'}}>
        <svg width={180} height={104} viewBox="0 0 180 104">
          <path d={trackPath} fill="none" stroke="var(--bg-hover)" strokeWidth={14} strokeLinecap="round"/>
          {[60,90].map(v => {
            const a = startA + (endA-startA)*(v/max);
            const i = toXY(a), o = { x: cx+(r+10)*Math.cos(a), y: cy+(r+10)*Math.sin(a) };
            const ii = { x: cx+(r-10)*Math.cos(a), y: cy+(r-10)*Math.sin(a) };
            return <line key={v} x1={ii.x} y1={ii.y} x2={o.x} y2={o.y} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}/>;
          })}
          {pct>0&&<path d={fillPath} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" style={{filter:`drop-shadow(0 0 6px ${color}60)`,transition:'all 500ms ease'}}/>}
          <text x={cx} y={cy-10} textAnchor="middle" fill={color} style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:600}}>{value.toFixed(0)}%</text>
          <text x={cx} y={cy+10} textAnchor="middle" fill="#56546a" style={{fontFamily:'var(--font-body)',fontSize:10}}>of GDP</text>
          <text x={14} y={100} fill="#56546a" style={{fontSize:9}}>0%</text>
          <text x={148} y={100} fill="#56546a" style={{fontSize:9}}>150%</text>
        </svg>
      </div>
      <div style={{display:'flex',gap:4,marginTop:4,justifyContent:'center'}}>
        {data.map((v,i) => {
          const c2 = v<60?'#4dffc8':v<90?'#ffb84d':'#ff5f5f';
          return <div key={i} style={{textAlign:'center'}}><div style={{height:3,width:28,background:c2,borderRadius:2,marginBottom:3,opacity:0.7}}/><div style={{fontSize:9,color:'#56546a'}}>Y{i+1}</div></div>;
        })}
      </div>
    </div>
  );
}

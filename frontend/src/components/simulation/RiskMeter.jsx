import React from 'react';

const LEVELS = {
  stable:   {color:'#4dffc8', pct:16,  icon:'✓'},
  moderate: {color:'#ffb84d', pct:52,  icon:'⚠'},
  crisis:   {color:'#ff5f5f', pct:88,  icon:'⚡'},
};

export default function RiskMeter({ riskLevel, riskReasons }) {
  const lvl = LEVELS[riskLevel] || LEVELS.stable;
  return (
    <div style={{background:'var(--bg-card)',border:`1px solid ${lvl.color}28`,borderRadius:'var(--radius-lg)',padding:'20px 24px',display:'flex',flexDirection:'column',gap:16,height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div className="section-label" style={{margin:0}}>Economic Health</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:600,color:lvl.color,marginTop:4}}>
            {(riskLevel||'stable').charAt(0).toUpperCase()+(riskLevel||'stable').slice(1)}
          </div>
        </div>
        <div style={{width:48,height:48,borderRadius:'50%',background:`${lvl.color}18`,border:`2px solid ${lvl.color}50`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:riskLevel==='crisis'?`0 0 20px ${lvl.color}40`:'none'}}>
          {lvl.icon}
        </div>
      </div>
      <div>
        <div style={{height:8,borderRadius:4,background:'linear-gradient(90deg,#4dffc8 0%,#ffb84d 50%,#ff5f5f 100%)',position:'relative'}}>
          <div style={{position:'absolute',left:`${lvl.pct}%`,top:'50%',transform:'translate(-50%,-50%)',width:18,height:18,borderRadius:'50%',background:lvl.color,border:'3px solid var(--bg-card)',boxShadow:`0 0 12px ${lvl.color}80`,transition:'left 500ms cubic-bezier(0.4,0,0.2,1)'}} />
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:10,color:'var(--text-muted)'}}>
          <span>Stable</span><span>Moderate</span><span>Crisis</span>
        </div>
      </div>
      {riskReasons && riskReasons.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {riskReasons.map((r,i) => (
            <div key={i} style={{fontSize:12,color:'var(--text-secondary)',padding:'7px 10px',background:`${lvl.color}10`,border:`1px solid ${lvl.color}25`,borderRadius:'var(--radius-sm)',display:'flex',gap:8,alignItems:'flex-start'}}>
              <span style={{color:lvl.color,fontSize:10,marginTop:2}}>●</span>{r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

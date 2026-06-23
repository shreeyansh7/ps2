import React, { useEffect, useRef, useState } from 'react';

const REAL_LIFE = {
  gdp_growth:   v => v>=6?'Strong expansion — economy gaining significant output':v>=3?'Steady growth — average incomes rising':v>=0?'Sluggish — limited new jobs':'Contraction — layoffs rising',
  unemployment: v => `~${Math.round(v*1400*0.01)}M people without work`,
  inflation:    v => v>10?'Prices eroding purchasing power rapidly':v>4?'Rising faster than wages':v<0?'Deflation — debt burden growing':'Price stability maintained',
  debt_pct_gdp: v => v>90?'Crisis risk — bond yields spiking':v>60?'Heavy debt — crowding out spending':'Manageable — fiscal space available',
  poverty_index:v => `~${Math.round((v/100)*1400)}M people below poverty line`,
  gini_coeff:   v => v>0.5?'Extreme inequality':v>0.35?'Moderate wealth gap':'Relatively equal society',
};

const CONFIG = {
  gdp_growth:   {label:'GDP Growth',     unit:'%',    color:'#c8ff6e',icon:'📈'},
  unemployment: {label:'Unemployment',   unit:'%',    color:'#ff5f5f',icon:'👷'},
  inflation:    {label:'Inflation Rate', unit:'%',    color:'#ffb84d',icon:'💸'},
  debt_pct_gdp: {label:'Public Debt',    unit:'% GDP',color:'#b06dff',icon:'🏦'},
  poverty_index:{label:'Poverty Index',  unit:'',     color:'#ff8c42',icon:'🏠'},
  gini_coeff:   {label:'Gini Coeff.',    unit:'',     color:'#6eb4ff',icon:'⚖️'},
};

function useAnimNum(target, dec) {
  dec = dec !== undefined ? dec : 1;
  const [val, setVal] = useState(target);
  const raf = useRef(null); const start = useRef(null); const from = useRef(target);
  useEffect(() => {
    const f = from.current, t = target;
    if (f === t) return;
    cancelAnimationFrame(raf.current); start.current = null;
    raf.current = requestAnimationFrame(function tick(time) {
      if (!start.current) start.current = time;
      const p = Math.min((time - start.current) / 600, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((f + (t - f) * e).toFixed(dec)));
      if (p < 1) { raf.current = requestAnimationFrame(tick); } else { from.current = t; }
    });
    return () => cancelAnimationFrame(raf.current);
  }, [target, dec]);
  return val;
}

export default function MetricCard({ metricKey, value, animDelay }) {
  const dec     = metricKey === 'gini_coeff' ? 3 : 1;
  const display = useAnimNum(value, dec);
  const cfg     = CONFIG[metricKey];
  if (!cfg) return null;

  const trendColor = () => {
    if (metricKey==='gdp_growth')   return value>=3?'#4dffc8':value>=0?'#ffb84d':'#ff5f5f';
    if (metricKey==='inflation')    return value<=4?'#4dffc8':value<=8?'#ffb84d':'#ff5f5f';
    if (metricKey==='debt_pct_gdp') return value<=60?'#4dffc8':value<=90?'#ffb84d':'#ff5f5f';
    return value<5?'#4dffc8':value<10?'#ffb84d':'#ff5f5f';
  };
  const tc = trendColor();

  return (
    <div className="animate-fade-up" style={{animationDelay:(animDelay||0)+'ms',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',padding:'18px 20px',display:'flex',flexDirection:'column',gap:10,position:'relative',overflow:'hidden',transition:'border-color 200ms,transform 200ms'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-default)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-subtle)';e.currentTarget.style.transform='translateY(0)'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:cfg.color,opacity:0.7}} />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:16}}>{cfg.icon}</span>
          <span style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)'}}>{cfg.label}</span>
        </div>
        <div style={{width:8,height:8,borderRadius:'50%',background:tc,boxShadow:`0 0 6px ${tc}`,marginTop:3}} />
      </div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:32,fontWeight:600,letterSpacing:'-0.03em',color:cfg.color,lineHeight:1}}>
        {display}{cfg.unit}
      </div>
      <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.4,padding:'8px 10px',background:'var(--bg-elevated)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border-subtle)'}}>
        {REAL_LIFE[metricKey]?.(value)}
      </div>
    </div>
  );
}

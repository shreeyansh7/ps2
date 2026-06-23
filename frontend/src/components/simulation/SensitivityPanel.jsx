import React from 'react';
import useSimulationStore from '../../store/simulationStore';

const LABELS = {edu_spend:'Education',infra_spend:'Infrastructure',rd_spend:'R&D',health_spend:'Healthcare',subsidy:'Subsidies',income_tax:'Income Tax',corp_tax:'Corporate Tax',min_wage_delta:'Min Wage'};

export default function SensitivityPanel() {
  const sensitivity = useSimulationStore(s => s.sensitivity) || {};
  const entries = Object.entries(sensitivity).map(([k,v])=>({k,v})).sort((a,b)=>Math.abs(b.v)-Math.abs(a.v));
  if (!entries.length) return null;
  const maxAbs = Math.max(...entries.map(e=>Math.abs(e.v)));
  return (
    <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',padding:'20px 24px',marginTop:'var(--space-md)'}}>
      <div className="section-label">Sensitivity Analysis</div>
      <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:16,marginTop:-8}}>GDP impact of +1% change in each variable</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {entries.map(({k,v},i) => {
          const pos = v >= 0;
          const color = pos ? '#4dffc8' : '#ff5f5f';
          return (
            <div key={k} style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:22,height:22,borderRadius:6,background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--text-muted)'}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{LABELS[k]||k}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:12,color,fontWeight:600}}>{pos?'+':''}{v.toFixed(3)}%</span>
                </div>
                <div style={{height:4,background:'var(--bg-hover)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(Math.abs(v)/maxAbs)*100}%`,background:color,borderRadius:2,transition:'width 400ms ease'}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

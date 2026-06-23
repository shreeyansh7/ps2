import React from 'react';
import useSimulationStore from '../../store/simulationStore';
import { useSimulation } from '../../hooks/useSimulation';

const COUNTRIES = [
  {code:'IN',flag:'🇮🇳',name:'India',     short:'High subsidy, growing'},
  {code:'US',flag:'🇺🇸',name:'USA',       short:'Market-led, high R&D'},
  {code:'SE',flag:'🇸🇪',name:'Sweden',    short:'Nordic welfare model'},
  {code:'SG',flag:'🇸🇬',name:'Singapore', short:'Low tax, efficient'},
  {code:'BR',flag:'🇧🇷',name:'Brazil',    short:'Emerging, high inequality'},
];

export default function CountryPicker() {
  const activeCountry = useSimulationStore(s => s.activeCountry);
  const { loadPreset } = useSimulation();
  return (
    <div>
      <div className="section-label">Country Presets</div>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {COUNTRIES.map(c => {
          const active = activeCountry === c.code;
          return (
            <button key={c.code} onClick={() => loadPreset(c.code)} style={{
              display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',
              padding:'10px 12px',
              background: active ? 'rgba(200,255,110,0.08)' : 'var(--bg-elevated)',
              border: `1px solid ${active ? 'rgba(200,255,110,0.4)' : 'var(--border-subtle)'}`,
              borderRadius:'var(--radius-md)',color:'var(--text-primary)',
              cursor:'pointer',transition:'all 150ms',fontFamily:'var(--font-body)',
            }}>
              <span style={{fontSize:20}}>{c.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:active?'var(--accent-primary)':'var(--text-primary)'}}>{c.name}</div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>{c.short}</div>
              </div>
              {active && <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent-primary)',boxShadow:'0 0 6px var(--accent-primary)'}} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

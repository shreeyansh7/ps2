import React, { useCallback } from 'react';
import useSimulationStore from '../../store/simulationStore';
import { useSimulation } from '../../hooks/useSimulation';

const SLIDERS = [
  {key:'income_tax',    label:'Income Tax Rate',       unit:'%',    min:0,   max:60,  step:0.5,  color:'#6eb4ff', icon:'👤', hint:'Tax drag on consumption'},
  {key:'corp_tax',      label:'Corporate Tax Rate',    unit:'%',    min:0,   max:45,  step:0.5,  color:'#b06dff', icon:'🏢', hint:'Tax drag on investment'},
  {key:'edu_spend',     label:'Education Spending',    unit:'% GDP',min:1,   max:15,  step:0.1,  color:'#c8ff6e', icon:'📚', hint:'Highest long-run GDP multiplier'},
  {key:'health_spend',  label:'Healthcare Budget',     unit:'% GDP',min:1,   max:20,  step:0.1,  color:'#4dffc8', icon:'⚕️', hint:'Workforce productivity'},
  {key:'infra_spend',   label:'Infrastructure',        unit:'% GDP',min:0.5, max:10,  step:0.1,  color:'#ffb84d', icon:'🏗️', hint:'Immediate jobs + connectivity'},
  {key:'subsidy',       label:'Subsidy Allocation',    unit:'% GDP',min:0,   max:8,   step:0.1,  color:'#ff8c42', icon:'🎯', hint:'Direct relief; inflates prices'},
  {key:'min_wage_delta',label:'Min Wage Change',       unit:'%',    min:-10, max:50,  step:1,    color:'#ff5f5f', icon:'💰', hint:'Wage-push inflation risk'},
  {key:'rd_spend',      label:'R&D / Innovation',      unit:'% GDP',min:0,   max:5,   step:0.1,  color:'#c084fc', icon:'🔬', hint:'Exponential payoff after yr 3'},
];

function Slider({ s, value, onChange }) {
  const pct = ((value - s.min) / (s.max - s.min)) * 100;
  const prefix = (s.key === 'min_wage_delta' && value > 0) ? '+' : '';
  return (
    <div style={{padding:'14px 0',borderBottom:'1px solid var(--border-subtle)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:7,fontSize:13,fontWeight:500}}>
            <span style={{fontSize:14}}>{s.icon}</span>{s.label}
          </div>
          <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{s.hint}</div>
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:13,fontWeight:600,color:s.color,minWidth:64,textAlign:'right',background:`${s.color}18`,padding:'3px 8px',borderRadius:6,border:`1px solid ${s.color}30`}}>
          {prefix}{value}{s.unit}
        </div>
      </div>
      <div style={{position:'relative',height:20,display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',inset:'50% 0',height:4,background:'var(--bg-hover)',borderRadius:2,transform:'translateY(-50%)'}} />
        <div style={{position:'absolute',left:0,top:'50%',height:4,width:`${pct}%`,background:`linear-gradient(90deg,${s.color}88,${s.color})`,borderRadius:2,transform:'translateY(-50%)',transition:'width 80ms'}} />
        <input type="range" min={s.min} max={s.max} step={s.step} value={value}
          onChange={e => onChange(s.key, parseFloat(e.target.value))}
          style={{position:'absolute',inset:0,width:'100%',opacity:0,cursor:'pointer',height:20,margin:0}} />
        <div style={{position:'absolute',left:`calc(${pct}% - 8px)`,top:'50%',transform:'translateY(-50%)',width:16,height:16,borderRadius:'50%',background:s.color,boxShadow:`0 0 10px ${s.color}60`,border:'2px solid var(--bg-base)',transition:'left 80ms',pointerEvents:'none'}} />
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:10,color:'var(--text-muted)'}}>
        <span>{s.min}{s.unit}</span><span>{s.max}{s.unit}</span>
      </div>
    </div>
  );
}

export default function SliderPanel() {
  const inputs        = useSimulationStore(s => s.inputs);
  const activeCountry = useSimulationStore(s => s.activeCountry);
  const { debouncedSimulate } = useSimulation();

  const handleChange = useCallback((key, value) => {
    useSimulationStore.getState().updateInput(key, value);
    const updated = { ...useSimulationStore.getState().inputs, [key]: value };
    debouncedSimulate(updated, null);
  }, [debouncedSimulate]);

  const handleReset = () => {
    useSimulationStore.getState().resetInputs();
    debouncedSimulate(useSimulationStore.getState().inputs, null);
  };

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--space-md)',paddingBottom:'var(--space-md)',borderBottom:'1px solid var(--border-subtle)'}}>
        <div>
          <div className="section-label" style={{margin:0}}>Policy Levers</div>
          {activeCountry && <div style={{fontSize:11,color:'var(--accent-primary)',marginTop:3}}>Based on {activeCountry} preset</div>}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset</button>
      </div>
      <div style={{flex:1,overflowY:'auto',paddingRight:4}}>
        {SLIDERS.map(s => <Slider key={s.key} s={s} value={inputs[s.key] ?? s.min} onChange={handleChange} />)}
      </div>
    </div>
  );
}

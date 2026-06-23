import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScenarioStore from '../store/scenarioStore';
import useSimulationStore from '../store/simulationStore';

const RISK_C = {
  stable:   {color:'#4dffc8',bg:'rgba(77,255,200,0.08)',border:'rgba(77,255,200,0.2)'},
  moderate: {color:'#ffb84d',bg:'rgba(255,184,77,0.08)',border:'rgba(255,184,77,0.2)'},
  crisis:   {color:'#ff5f5f',bg:'rgba(255,95,95,0.08)', border:'rgba(255,95,95,0.2)'},
};

function ScenarioCard({ s, onDelete, onLoad }) {
  const [confirm, setConfirm] = useState(false);
  const risk = RISK_C[s.risk_level] || RISK_C.moderate;
  const date = new Date(s.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  return (
    <div style={{background:'var(--bg-card)',border:`1px solid ${risk.border}`,borderRadius:'var(--radius-lg)',padding:'var(--space-lg)',display:'flex',flexDirection:'column',gap:14,transition:'transform 200ms'}}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <h3 style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:600,marginBottom:4}}>{s.name}</h3>
          {s.description&&<p style={{fontSize:12,color:'var(--text-muted)'}}>{s.description}</p>}
        </div>
        <span style={{padding:'3px 10px',borderRadius:20,background:risk.bg,border:`1px solid ${risk.border}`,fontSize:11,fontWeight:600,color:risk.color,textTransform:'uppercase',letterSpacing:'0.06em'}}>
          {s.risk_level}
        </span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
        {[{l:'GDP Yr5',v:s.outputs?.gdp_growth?.[4]!=null?`${s.outputs.gdp_growth[4]}%`:'—',c:'#c8ff6e'},
          {l:'Inflation',v:s.outputs?.inflation?.[0]!=null?`${s.outputs.inflation[0]}%`:'—',c:'#ffb84d'},
          {l:'Unemploy.',v:s.outputs?.unemployment?.[0]!=null?`${s.outputs.unemployment[0]}%`:'—',c:'#6eb4ff'}].map(m=>(
          <div key={m.l} style={{padding:'8px 10px',background:'var(--bg-elevated)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border-subtle)',textAlign:'center'}}>
            <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}>{m.l}</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:14,fontWeight:600,color:m.c}}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)'}}>
        <span>{s.base_country?`Based on ${s.base_country}`:'Custom policy'}</span><span>{date}</span>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={() => onLoad(s)}>Load into Simulator</button>
        {confirm
          ? <><button className="btn btn-danger btn-sm" onClick={() => onDelete(s._id)}>Confirm</button><button className="btn btn-ghost btn-sm" onClick={() => setConfirm(false)}>Cancel</button></>
          : <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(true)}>🗑</button>}
      </div>
    </div>
  );
}

export default function History() {
  const scenarios    = useScenarioStore(s => s.scenarios);
  const isLoading    = useScenarioStore(s => s.isLoading);
  const fetchScenarios = useScenarioStore(s => s.fetchScenarios);
  const deleteScenario = useScenarioStore(s => s.deleteScenario);
  const navigate = useNavigate();

  useEffect(() => { fetchScenarios(); }, []);

  const handleLoad = (s) => {
    useSimulationStore.getState().setInputs(s.inputs);
    useSimulationStore.getState().setOutputs(s.outputs, s.risk_level, [], {}, []);
    navigate('/');
  };

  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'var(--space-xl)'}}>
      <div style={{marginBottom:'var(--space-xl)'}}>
        <div className="section-label">Saved Scenarios</div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:700,letterSpacing:'-0.02em'}}>Policy History</h1>
        <p style={{color:'var(--text-secondary)',marginTop:8}}>Your saved simulation configurations and their outcomes.</p>
      </div>
      {isLoading ? (
        <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner" style={{width:28,height:28}}/></div>
      ) : scenarios.length === 0 ? (
        <div style={{textAlign:'center',padding:80,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-xl)'}}>
          <div style={{fontSize:48,marginBottom:16}}>📂</div>
          <h3 style={{fontFamily:'var(--font-display)',marginBottom:8}}>No saved scenarios yet</h3>
          <p style={{color:'var(--text-muted)',fontSize:14,marginBottom:24}}>Run a simulation and click Save Scenario.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Simulator</button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'var(--space-md)'}}>
          {scenarios.map(s => <ScenarioCard key={s._id} s={s} onDelete={deleteScenario} onLoad={handleLoad}/>)}
        </div>
      )}
    </div>
  );
}

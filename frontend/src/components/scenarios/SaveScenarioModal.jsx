import React, { useState } from 'react';
import useSimulationStore from '../../store/simulationStore';
import useScenarioStore from '../../store/scenarioStore';

export default function SaveScenarioModal({ onClose, onSaved }) {
  const [name, setName]         = useState('');
  const [desc, setDesc]         = useState('');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const inputs        = useSimulationStore(s => s.inputs);
  const outputs       = useSimulationStore(s => s.outputs);
  const riskLevel     = useSimulationStore(s => s.riskLevel);
  const activeCountry = useSimulationStore(s => s.activeCountry);
  const saveScenario  = useScenarioStore(s => s.saveScenario);

  const save = async () => {
    if (!name.trim()) { setError('Please enter a name'); return; }
    setSaving(true); setError('');
    try {
      await saveScenario({ name:name.trim(), description:desc.trim(), inputs, outputs, risk_level:riskLevel, base_country:activeCountry });
      onSaved?.(); onClose();
    } catch(e) { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:600,marginBottom:6}}>Save Scenario</h3>
        <p style={{fontSize:13,color:'var(--text-secondary)',marginBottom:24}}>Save your current policy configuration and results.</p>
        <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:20}}>
          <div className="input-group">
            <label className="input-label">Scenario Name *</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Nordic Model Test" autoFocus onKeyDown={e=>e.key==='Enter'&&save()}/>
          </div>
          <div className="input-group">
            <label className="input-label">Notes (optional)</label>
            <textarea className="input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What were you testing?" rows={2} style={{resize:'vertical'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:16,padding:'12px 14px',background:'var(--bg-base)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',marginBottom:16}}>
          {[{l:'GDP Yr5',v:`${outputs?.gdp_growth?.[4]??'—'}%`,c:'#c8ff6e'},{l:'Inflation',v:`${outputs?.inflation?.[0]??'—'}%`,c:'#ffb84d'},{l:'Risk',v:riskLevel,c:riskLevel==='stable'?'#4dffc8':riskLevel==='moderate'?'#ffb84d':'#ff5f5f'}].map(m=>(
            <div key={m.l} style={{textAlign:'center'}}>
              <div style={{fontSize:10,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{m.l}</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:14,fontWeight:600,color:m.c}}>{m.v}</div>
            </div>
          ))}
        </div>
        {error&&<div style={{padding:'8px 12px',marginBottom:12,background:'rgba(255,95,95,0.1)',border:'1px solid rgba(255,95,95,0.3)',borderRadius:'var(--radius-sm)',fontSize:13,color:'var(--accent-red)'}}>{error}</div>}
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving?<><div className="spinner" style={{width:14,height:14}}/>Saving…</>:'Save Scenario'}
          </button>
        </div>
      </div>
    </div>
  );
}

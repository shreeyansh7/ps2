import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useSimulationStore from '../store/simulationStore';
import { useSimulation } from '../hooks/useSimulation';

const EXAMPLES = ['Reduce poverty without increasing debt','Maximize GDP growth over 5 years','Control inflation while keeping jobs','Reduce unemployment through infrastructure','Achieve fiscal discipline — cut the deficit'];
const LABELS = {income_tax:'Income Tax',corp_tax:'Corp Tax',edu_spend:'Education',health_spend:'Healthcare',infra_spend:'Infrastructure',subsidy:'Subsidies',min_wage_delta:'Min Wage Δ',rd_spend:'R&D'};

export default function Advisor() {
  const [goal, setGoal]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const { simulate } = useSimulation();
  const navigate = useNavigate();
  const inputs = useSimulationStore(s => s.inputs);

  const ask = async () => {
    if (!goal.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.post('/advisor', { goal });
      setResult(data.advice);
    } catch(e) { setError('Failed to get advice. Make sure you are logged in.'); }
    finally { setLoading(false); }
  };

  const apply = () => {
    if (!result?.adjustments) return;
    const current = useSimulationStore.getState().inputs;
    const updated = { ...current };
    Object.entries(result.adjustments).forEach(([k,d]) => { updated[k] = Math.max(0, (current[k]||0)+d); });
    useSimulationStore.getState().setInputs(updated);
    simulate(updated, null);
    navigate('/');
  };

  return (
    <div style={{maxWidth:760,margin:'0 auto',padding:'var(--space-xl)'}}>
      <div style={{marginBottom:'var(--space-xl)'}}>
        <div className="section-label">AI-Powered</div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:700,letterSpacing:'-0.02em'}}>Policy Advisor</h1>
        <p style={{color:'var(--text-secondary)',marginTop:8}}>Describe your goal in plain English. The advisor recommends slider adjustments with an explanation of the causal chain.</p>
      </div>

      <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-xl)',padding:'var(--space-xl)',marginBottom:'var(--space-lg)'}}>
        <label className="input-label">What economic goal do you want to achieve?</label>
        <textarea className="input" value={goal} onChange={e=>setGoal(e.target.value)} placeholder="e.g. Reduce poverty without increasing debt" rows={3} style={{resize:'none',marginBottom:16}} onKeyDown={e=>e.key==='Enter'&&e.ctrlKey&&ask()}/>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20}}>
          {EXAMPLES.map(ex=><button key={ex} className="btn btn-ghost btn-sm" style={{fontSize:11,padding:'4px 10px',border:'1px solid var(--border-default)'}} onClick={()=>setGoal(ex)}>{ex}</button>)}
        </div>
        <button className="btn btn-primary" onClick={ask} disabled={loading||!goal.trim()} style={{width:'100%',justifyContent:'center'}}>
          {loading?<><div className="spinner" style={{width:14,height:14}}/>Analysing…</>:'✨ Get Policy Advice'}
        </button>
      </div>

      {error&&<div style={{padding:'12px 16px',marginBottom:'var(--space-lg)',background:'rgba(255,95,95,0.1)',border:'1px solid rgba(255,95,95,0.3)',borderRadius:'var(--radius-md)',fontSize:13,color:'var(--accent-red)'}}>{error}</div>}

      {result&&(
        <div className="animate-fade-up" style={{display:'flex',flexDirection:'column',gap:'var(--space-md)'}}>
          {!result.matched ? (
            <div style={{padding:'var(--space-lg)',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',color:'var(--text-secondary)',fontSize:14}}>{result.message}</div>
          ) : (
            <>
              <div style={{padding:'var(--space-lg)',background:'var(--bg-card)',border:'1px solid rgba(200,255,110,0.2)',borderRadius:'var(--radius-lg)'}}>
                <div className="section-label">Recommendation</div>
                <p style={{fontSize:14,color:'var(--text-secondary)',lineHeight:1.7}}>{result.explanation}</p>
              </div>

              <div style={{padding:'var(--space-lg)',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)'}}>
                <div className="section-label">Slider Adjustments</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {Object.entries(result.adjustments).map(([k,d]) => {
                    const cur = inputs[k]||0; const color = d>0?'#4dffc8':'#ffb84d';
                    return (
                      <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)'}}>
                        <span style={{fontSize:13}}>{LABELS[k]||k}</span>
                        <div style={{display:'flex',alignItems:'center',gap:12}}>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-muted)'}}>{cur.toFixed(1)} →</span>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:14,fontWeight:600,color}}>{(cur+d).toFixed(1)}</span>
                          <span style={{fontSize:12,color,fontWeight:600}}>({d>0?'+':''}{d})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {result.causal_chain&&(
                <div style={{padding:'var(--space-lg)',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)'}}>
                  <div className="section-label">Why This Works — Causal Chain</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {result.causal_chain.map((step,i) => (
                      <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',fontSize:13,color:'var(--text-secondary)',lineHeight:1.5}}>
                        <div style={{minWidth:22,height:22,background:'var(--accent-primary)',color:'#08080e',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,marginTop:1}}>{i+1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-lg" onClick={apply} style={{width:'100%',justifyContent:'center'}}>
                Apply These Adjustments to Simulator →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import useSimulationStore from '../store/simulationStore';
import { useSimulation } from '../hooks/useSimulation';
import SliderPanel from '../components/simulation/SliderPanel';
import MetricCard from '../components/simulation/MetricCard';
import RiskMeter from '../components/simulation/RiskMeter';
import CountryPicker from '../components/simulation/CountryPicker';
import SensitivityPanel from '../components/simulation/SensitivityPanel';
import PlaybackTimeline from '../components/simulation/PlaybackTimeline';
import GDPChart from '../components/charts/GDPChart';
import InflationChart from '../components/charts/InflationChart';
import UnemploymentChart from '../components/charts/UnemploymentChart';
import PovertyChart from '../components/charts/PovertyChart';
import DebtGauge from '../components/charts/DebtGauge';
import SaveScenarioModal from '../components/scenarios/SaveScenarioModal';

const FALLBACK = {gdp_growth:[0,0,0,0,0],unemployment:[0,0,0,0,0],inflation:[0,0,0,0,0],debt_pct_gdp:[65,65,65,65,65],poverty_index:[20,20,20,20,20],gini_coeff:0.32};

export default function Dashboard() {
  const rawOutputs  = useSimulationStore(s => s.outputs);
  const riskLevel   = useSimulationStore(s => s.riskLevel)   || 'stable';
  const riskReasons = useSimulationStore(s => s.riskReasons) || [];
  const isLoading   = useSimulationStore(s => s.isLoading)   || false;
  const warnings    = useSimulationStore(s => s.warnings)    || [];
  const playbackYear= useSimulationStore(s => s.playbackYear)|| 0;
  const outputs     = rawOutputs || FALLBACK;

  const { simulate }  = useSimulation();
  const [showSave, setShowSave] = useState(false);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    const { inputs, activeCountry } = useSimulationStore.getState();
    simulate(inputs, activeCountry);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const yr = playbackYear;

  const metrics = [
    {key:'gdp_growth',    value:(outputs.gdp_growth    ||[])[yr]||0},
    {key:'unemployment',  value:(outputs.unemployment  ||[])[yr]||0},
    {key:'inflation',     value:(outputs.inflation     ||[])[yr]||0},
    {key:'debt_pct_gdp',  value:(outputs.debt_pct_gdp  ||[])[yr]||0},
    {key:'poverty_index', value:(outputs.poverty_index ||[])[yr]||0},
    {key:'gini_coeff',    value:outputs.gini_coeff||0},
  ];

  const card = (children) => (
    <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',padding:'var(--space-lg)'}}>
      {children}
    </div>
  );

  return (
    <div style={{display:'flex',height:'calc(100vh - var(--navbar-height))'}}>
      {/* Sidebar */}
      <aside style={{width:'var(--sidebar-width)',minWidth:'var(--sidebar-width)',borderRight:'1px solid var(--border-subtle)',display:'flex',flexDirection:'column',background:'var(--bg-surface)',overflow:'hidden'}}>
        <div style={{padding:'var(--space-lg)',borderBottom:'1px solid var(--border-subtle)'}}><CountryPicker/></div>
        <div style={{flex:1,overflowY:'auto',padding:'var(--space-lg)'}}><SliderPanel/></div>
        <div style={{padding:'var(--space-md) var(--space-lg)',borderTop:'1px solid var(--border-subtle)'}}>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => setShowSave(true)}>💾 Save Scenario</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{flex:1,overflowY:'auto',padding:'var(--space-xl)',position:'relative'}}>
        {isLoading && (
          <div style={{position:'fixed',inset:0,zIndex:40,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)',backdropFilter:'blur(2px)',pointerEvents:'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-md)',fontSize:13,color:'var(--text-secondary)'}}>
              <div className="spinner"/>Running simulation…
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div style={{padding:'10px 16px',marginBottom:20,background:'rgba(255,184,77,0.08)',border:'1px solid rgba(255,184,77,0.25)',borderRadius:'var(--radius-md)',fontSize:12,color:'var(--accent-amber)',display:'flex',gap:12,flexWrap:'wrap'}}>
            {warnings.map((w,i) => <span key={i}>{w}</span>)}
          </div>
        )}

        <div style={{marginBottom:'var(--space-lg)'}}><PlaybackTimeline/></div>

        {/* Risk + metrics */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-md)',marginBottom:'var(--space-xl)'}}>
          <div style={{gridColumn:1,gridRow:'1/3'}}><RiskMeter riskLevel={riskLevel} riskReasons={riskReasons}/></div>
          {metrics.slice(0,2).map((m,i) => <MetricCard key={m.key} metricKey={m.key} value={m.value} animDelay={i*60}/>)}
          {metrics.slice(2,4).map((m,i) => <MetricCard key={m.key} metricKey={m.key} value={m.value} animDelay={(i+2)*60}/>)}
          {metrics.slice(4).map((m,i)   => <MetricCard key={m.key} metricKey={m.key} value={m.value} animDelay={(i+4)*60}/>)}
        </div>

        {/* Charts row 1 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-md)',marginBottom:'var(--space-md)'}}>
          {card(<GDPChart data={outputs.gdp_growth||[]}/>)}
          {card(<InflationChart data={outputs.inflation||[]}/>)}
        </div>

        {/* Charts row 2 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-md)',marginBottom:'var(--space-md)'}}>
          {card(<UnemploymentChart data={outputs.unemployment||[]}/>)}
          {card(<PovertyChart data={outputs.poverty_index||[]}/>)}
          {card(<DebtGauge data={outputs.debt_pct_gdp||[]}/>)}
        </div>

        <SensitivityPanel/>
      </main>

      {showSave && <SaveScenarioModal onClose={() => setShowSave(false)} onSaved={() => showToast('Scenario saved!')}/>}
      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </div>
  );
}

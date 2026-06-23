import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useScenarioStore from '../store/scenarioStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const METRICS = [
  {key:'gdp_growth',   label:'GDP Growth',   unit:'%',     good:'high'},
  {key:'unemployment', label:'Unemployment', unit:'%',     good:'low'},
  {key:'inflation',    label:'Inflation',    unit:'%',     good:'low'},
  {key:'debt_pct_gdp', label:'Public Debt',  unit:'% GDP', good:'low'},
  {key:'poverty_index',label:'Poverty',      unit:'',      good:'low'},
];

const INPUTS = {income_tax:'Income Tax',corp_tax:'Corp Tax',edu_spend:'Education',health_spend:'Healthcare',infra_spend:'Infrastructure',subsidy:'Subsidies',min_wage_delta:'Min Wage Δ',rd_spend:'R&D'};

function Delta({a,b,good}) {
  if (a==null||b==null) return null;
  const d = b-a;
  const good_dir = good==='high' ? d>0 : d<0;
  const color = Math.abs(d)<0.05?'#56546a':good_dir?'#4dffc8':'#ff5f5f';
  return <span style={{fontFamily:'var(--font-mono)',fontSize:12,color,marginLeft:8}}>{d>=0?'+':''}{d.toFixed(1)}</span>;
}

export default function Compare() {
  const scenarios    = useScenarioStore(s => s.scenarios);
  const compareA     = useScenarioStore(s => s.compareA);
  const compareB     = useScenarioStore(s => s.compareB);
  const setCompareA  = useScenarioStore(s => s.setCompareA);
  const setCompareB  = useScenarioStore(s => s.setCompareB);
  const fetchScenarios = useScenarioStore(s => s.fetchScenarios);
  const navigate = useNavigate();
  useEffect(() => { fetchScenarios(); }, []);

  const sel = (label,val,onChange) => (
    <div style={{flex:1}}>
      <div className="section-label">{label}</div>
      <select className="input" value={val?._id||''} onChange={e => onChange(scenarios.find(s=>s._id===e.target.value)||null)}>
        <option value="">— Select scenario —</option>
        {scenarios.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>
    </div>
  );

  const card = children => <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',padding:'var(--space-lg)',marginTop:'var(--space-lg)'}}>{children}</div>;

  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'var(--space-xl)'}}>
      <div style={{marginBottom:'var(--space-xl)'}}>
        <div className="section-label">Comparison Tool</div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:700,letterSpacing:'-0.02em'}}>Compare Scenarios</h1>
      </div>

      <div style={{display:'flex',gap:'var(--space-lg)',padding:'var(--space-lg)',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)'}}>
        {sel('Scenario A',compareA,setCompareA)}
        <div style={{display:'flex',alignItems:'flex-end',paddingBottom:10,fontSize:18,color:'var(--text-muted)'}}>vs</div>
        {sel('Scenario B',compareB,setCompareB)}
      </div>

      {!(compareA&&compareB) ? (
        <div style={{textAlign:'center',padding:80,marginTop:'var(--space-lg)',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-xl)'}}>
          {scenarios.length < 2
            ? <><div style={{fontSize:48,marginBottom:16}}>⚖️</div><h3 style={{fontFamily:'var(--font-display)',marginBottom:8}}>Need at least 2 saved scenarios</h3><button className="btn btn-primary" onClick={()=>navigate('/')}>Go to Simulator</button></>
            : <><div style={{fontSize:48,marginBottom:16}}>👆</div><h3 style={{fontFamily:'var(--font-display)'}}>Select two scenarios above</h3></>}
        </div>
      ) : (
        <>
          {/* Headers */}
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr 1fr',gap:12,marginTop:'var(--space-lg)'}}>
            <div/>
            {[compareA,compareB].map((s,i) => (
              <div key={i} style={{padding:'14px 18px',background:'var(--bg-card)',border:`2px solid ${i===0?'#c8ff6e':'#6eb4ff'}40`,borderRadius:'var(--radius-md)',textAlign:'center'}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:600,color:i===0?'#c8ff6e':'#6eb4ff'}}>{s.name}</div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>{s.risk_level}</div>
              </div>
            ))}
          </div>

          {/* Metrics table */}
          {card(<>
            <div className="section-label">Key Metrics (Year 1)</div>
            {METRICS.map((m,i) => {
              const aArr = compareA.outputs?.[m.key]; const bArr = compareB.outputs?.[m.key];
              const aV = Array.isArray(aArr)?aArr[0]:aArr; const bV = Array.isArray(bArr)?bArr[0]:bArr;
              return (
                <div key={m.key} style={{display:'grid',gridTemplateColumns:'180px 1fr 1fr',gap:12,padding:'12px 0',borderBottom:i<METRICS.length-1?'1px solid var(--border-subtle)':'none',alignItems:'center'}}>
                  <span style={{fontSize:13,color:'var(--text-secondary)'}}>{m.label}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:16,fontWeight:600,color:'#c8ff6e'}}>{aV?.toFixed(1)??'—'}{m.unit}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:16,fontWeight:600,color:'#6eb4ff'}}>{bV?.toFixed(1)??'—'}{m.unit}<Delta a={aV} b={bV} good={m.good}/></span>
                </div>
              );
            })}
          </>)}

          {/* GDP chart */}
          {card(<>
            <div className="section-label">GDP Growth Trajectory</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart margin={{top:5,right:20,bottom:0,left:-20}}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
                <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#56546a',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:8,fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:12}}/>
                {[compareA,compareB].map((s,i) => (
                  <Line key={s._id} data={(s.outputs?.gdp_growth||[]).map((v,idx)=>({year:`Y${idx+1}`,value:v}))} dataKey="value" name={s.name} stroke={i===0?'#c8ff6e':'#6eb4ff'} strokeWidth={2} dot={{r:3,strokeWidth:0}} animationDuration={600}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>)}

          {/* Input diffs */}
          {card(<>
            <div className="section-label">Policy Input Differences (B minus A)</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {Object.entries(INPUTS).map(([key,label]) => {
                const d = (compareB.inputs?.[key]||0)-(compareA.inputs?.[key]||0);
                if (Math.abs(d)<0.05) return null;
                const color = d>0?'#ffb84d':'#4dffc8';
                return (
                  <div key={key} style={{display:'grid',gridTemplateColumns:'160px 1fr auto',alignItems:'center',gap:12,padding:'8px 12px',background:'var(--bg-elevated)',borderRadius:'var(--radius-sm)'}}>
                    <span style={{fontSize:12,color:'var(--text-secondary)'}}>{label}</span>
                    <div style={{height:3,background:'var(--bg-hover)',borderRadius:2,position:'relative'}}>
                      <div style={{position:'absolute',width:`${Math.min(Math.abs(d/50)*100,50)}%`,height:'100%',background:color,borderRadius:2,left:d>0?'50%':`calc(50% - ${Math.min(Math.abs(d/50)*100,50)}%)`}}/>
                    </div>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:12,color,width:52,textAlign:'right'}}>{d>=0?'+':''}{d.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </>)}
        </>
      )}
    </div>
  );
}

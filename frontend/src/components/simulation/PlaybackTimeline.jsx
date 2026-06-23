import React from 'react';
import useSimulationStore from '../../store/simulationStore';

export default function PlaybackTimeline() {
  const playbackYear    = useSimulationStore(s => s.playbackYear);
  const setPlaybackYear = useSimulationStore(s => s.setPlaybackYear);
  return (
    <div style={{display:'flex',alignItems:'center',gap:16,padding:'12px 20px',background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)'}}>
      <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',letterSpacing:'0.08em',whiteSpace:'nowrap'}}>VIEWING YEAR</div>
      <div style={{display:'flex',gap:6,flex:1}}>
        {[1,2,3,4,5].map(yr => {
          const active = playbackYear === yr-1;
          return (
            <button key={yr} onClick={() => setPlaybackYear(yr-1)} style={{flex:1,padding:'8px 0',background:active?'var(--accent-primary)':'var(--bg-elevated)',border:`1px solid ${active?'var(--accent-primary)':'var(--border-subtle)'}`,borderRadius:'var(--radius-sm)',color:active?'#08080e':'var(--text-muted)',fontFamily:'var(--font-body)',fontSize:13,fontWeight:active?700:500,cursor:'pointer',transition:'all 150ms'}}>
              Y{yr}
            </button>
          );
        })}
      </div>
      <div style={{fontSize:11,color:'var(--text-muted)'}}>5-yr projection</div>
    </div>
  );
}

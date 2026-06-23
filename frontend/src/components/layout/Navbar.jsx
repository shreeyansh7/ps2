import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSimulationStore from '../../store/simulationStore';

const LINKS = [
  { to:'/',        label:'Simulate' },
  { to:'/history', label:'History'  },
  { to:'/compare', label:'Compare'  },
  { to:'/advisor', label:'Advisor'  },
];

const RISK_COLORS = { stable:'#4dffc8', moderate:'#ffb84d', crisis:'#ff5f5f' };

export default function Navbar() {
  const user      = useAuthStore(s => s.user);
  const logout    = useAuthStore(s => s.logout);
  const riskLevel = useSimulationStore(s => s.riskLevel) || 'stable';
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const riskColor = RISK_COLORS[riskLevel] || '#4dffc8';
  const name      = user?.name  || 'User';
  const email     = user?.email || '';
  const initial   = name.charAt(0).toUpperCase();

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,height:'var(--navbar-height)',
      background:'rgba(8,8,14,0.88)',backdropFilter:'blur(20px)',
      borderBottom:'1px solid var(--border-subtle)',
      display:'flex',alignItems:'center',padding:'0 var(--space-xl)',
      zIndex:50,gap:'var(--space-xl)',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:32,height:32,background:'var(--accent-primary)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#08080e',fontFamily:'var(--font-display)'}}>P</div>
        <span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:16,letterSpacing:'-0.02em'}}>PolicySim</span>
      </div>

      <div style={{display:'flex',gap:4,flex:1}}>
        {LINKS.map(({to,label}) => (
          <NavLink key={to} to={to} end={to==='/'} style={({isActive}) => ({
            padding:'6px 14px',borderRadius:'var(--radius-sm)',fontSize:14,fontWeight:500,
            color:isActive?'var(--text-primary)':'var(--text-muted)',
            background:isActive?'var(--bg-elevated)':'transparent',
            transition:'all 150ms',textDecoration:'none',
          })}>{label}</NavLink>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'var(--space-md)'}}>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 12px',background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)',borderRadius:20,fontSize:12,fontWeight:500,color:riskColor}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:riskColor,boxShadow:`0 0 6px ${riskColor}`}} />
          {riskLevel.charAt(0).toUpperCase()+riskLevel.slice(1)}
        </div>

        <div style={{position:'relative'}}>
          <button onClick={() => setOpen(!open)} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',color:'var(--text-primary)',cursor:'pointer',fontSize:13,fontWeight:500,fontFamily:'var(--font-body)'}}>
            <div style={{width:24,height:24,borderRadius:'50%',background:'var(--accent-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#08080e'}}>{initial}</div>
            {name.split(' ')[0]}
          </button>
          {open && (
            <div style={{position:'absolute',top:'110%',right:0,background:'var(--bg-elevated)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-md)',padding:6,minWidth:180,boxShadow:'var(--shadow-lg)',zIndex:100}}>
              {email && <div style={{padding:'8px 12px',fontSize:12,color:'var(--text-muted)',borderBottom:'1px solid var(--border-subtle)',marginBottom:4}}>{email}</div>}
              <button onClick={() => { logout(); navigate('/login'); }} style={{width:'100%',textAlign:'left',padding:'8px 12px',background:'none',border:'none',color:'var(--accent-red)',cursor:'pointer',fontSize:13,borderRadius:'var(--radius-sm)',fontFamily:'var(--font-body)'}}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

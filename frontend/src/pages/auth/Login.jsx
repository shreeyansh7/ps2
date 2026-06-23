import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const login    = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch(e) { setError(e.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'var(--space-lg)',background:'var(--bg-base)',position:'relative'}}>
      <div className="blob-container"><div className="blob blob-1" /><div className="blob blob-2" /></div>
      <div className="animate-fade-up" style={{width:'100%',maxWidth:420,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-xl)',padding:'var(--space-2xl)',position:'relative',zIndex:1}}>
        <div style={{textAlign:'center',marginBottom:'var(--space-xl)'}}>
          <div style={{width:48,height:48,background:'var(--accent-primary)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,color:'#08080e',fontFamily:'var(--font-display)',margin:'0 auto 16px'}}>P</div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,letterSpacing:'-0.02em'}}>Welcome back</h1>
          <p style={{color:'var(--text-secondary)',fontSize:14,marginTop:6}}>Sign in to PolicySim</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-md)'}}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e=>e.key==='Enter'&&submit()} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&submit()} />
          </div>
          {error && <div style={{padding:'10px 14px',background:'rgba(255,95,95,0.1)',border:'1px solid rgba(255,95,95,0.3)',borderRadius:'var(--radius-sm)',fontSize:13,color:'var(--accent-red)'}}>{error}</div>}
          <button className="btn btn-primary" onClick={submit} disabled={loading} style={{width:'100%',padding:12,marginTop:8,justifyContent:'center'}}>
            {loading ? <><div className="spinner" style={{width:14,height:14}} /> Signing in…</> : 'Sign In'}
          </button>
          <p style={{textAlign:'center',fontSize:13,color:'var(--text-muted)'}}>No account? <Link to="/register" style={{color:'var(--accent-primary)'}}>Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

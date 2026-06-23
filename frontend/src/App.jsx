import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Compare from './pages/Compare';
import Advisor from './pages/Advisor';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './styles/globals.css';
import './styles/theme.css';
import './styles/animations.css';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">{children}</div>
    </>
  );
}

export default function App() {
  const isLoading = useAuthStore(s => s.isLoading);
  const initAuth  = useAuthStore(s => s.initAuth);

  useEffect(() => { initAuth(); }, [initAuth]);

  if (isLoading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-base)'}}>
      <div className="spinner" style={{width:32,height:32}} />
    </div>
  );

  return (
    <BrowserRouter>
      <div className="blob-container">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
      </div>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/"        element={<Layout><Dashboard /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/compare" element={<Layout><Compare /></Layout>} />
          <Route path="/advisor" element={<Layout><Advisor /></Layout>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

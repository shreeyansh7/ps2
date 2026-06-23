import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isLoading       = useAuthStore(s => s.isLoading);
  if (isLoading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-base)'}}>
      <div className="spinner" style={{width:28,height:28}} />
    </div>
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

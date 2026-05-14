// AdminDashboard.js - Admin home with stats overview
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getAdminStats, getAllRequests } from '../services/requestService';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [recent, setRecent]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAllRequests()])
      .then(([s, r]) => { setStats(s); setRecent(r.slice(0, 6)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label:'Total Requests', value: stats.total,      color:'#e0f2fe', icon:'📦', iconColor:'#0284c7' },
    { label:'Pending',        value: stats.pending,    color:'#fef3c7', icon:'⏳', iconColor:'#d97706' },
    { label:'In Progress',    value: stats.inProgress, color:'#dbeafe', icon:'🚛', iconColor:'#2563eb' },
    { label:'Completed',      value: stats.completed,  color:'#dcfce7', icon:'✅', iconColor:'#16a34a' },
    { label:'Cancelled',      value: stats.cancelled,  color:'#f3f4f6', icon:'❌', iconColor:'#6b7280' },
  ] : [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-header">
          <h2>Admin Dashboard</h2>
          <p>Overview of garbage management operations</p>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              {statCards.map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon" style={{ background: s.color }}>
                    <span style={{ fontSize:'1.3rem' }}>{s.icon}</span>
                  </div>
                  <div>
                    <p className="stat-value">{s.value}</p>
                    <p className="stat-label">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Waste Breakdown */}
            {stats?.wasteBreakdown && Object.keys(stats.wasteBreakdown).length > 0 && (
              <div className="card" style={{ marginBottom:24 }}>
                <div className="card-header">
                  <p className="card-title">Requests by Waste Type</p>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                  {Object.entries(stats.wasteBreakdown).map(([type, count]) => (
                    <div key={type} style={{ background:'var(--gray-50)', border:'1px solid var(--gray-200)', borderRadius:8, padding:'10px 16px', minWidth:140 }}>
                      <p style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--gray-900)' }}>{count}</p>
                      <p style={{ fontSize:'.78rem', color:'var(--gray-500)' }}>{type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
              <Link to="/admin/requests" className="card" style={{ textDecoration:'none', border:'2px solid var(--green-100)', transition:'all .18s', display:'block' }}>
                <div style={{ fontSize:'2rem', marginBottom:8 }}>📋</div>
                <p style={{ fontWeight:700, color:'var(--gray-900)' }}>Manage Requests</p>
                <p style={{ fontSize:'.82rem', color:'var(--gray-400)', marginTop:4 }}>View, assign and update all collection requests</p>
              </Link>
              <Link to="/admin/users" className="card" style={{ textDecoration:'none', border:'2px solid var(--blue-100)', transition:'all .18s', display:'block' }}>
                <div style={{ fontSize:'2rem', marginBottom:8 }}>👥</div>
                <p style={{ fontWeight:700, color:'var(--gray-900)' }}>Manage Users</p>
                <p style={{ fontSize:'.82rem', color:'var(--gray-400)', marginTop:4 }}>View registered users and control access</p>
              </Link>
            </div>

            {/* Recent Requests Table */}
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="card-title">Recent Requests</p>
                  <p className="card-subtitle">Latest 6 collection requests</p>
                </div>
                <Link to="/admin/requests" className="btn btn-outline btn-sm">View All</Link>
              </div>
              {recent.length === 0 ? (
                <div className="empty-state"><h3>No requests yet</h3></div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>#</th><th>User</th><th>Waste Type</th><th>Address</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {recent.map(r => (
                        <tr key={r.id}>
                          <td style={{ color:'var(--gray-400)', fontSize:'.8rem' }}>#{r.id}</td>
                          <td>{r.userName}</td>
                          <td>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                              <span style={{ width:8, height:8, borderRadius:'50%', background: r.wasteTypeColor || '#aaa', display:'inline-block' }} />
                              {r.wasteTypeName}
                            </span>
                          </td>
                          <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.pickupAddress}</td>
                          <td style={{ fontSize:'.8rem' }}>{r.scheduledDate}</td>
                          <td><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

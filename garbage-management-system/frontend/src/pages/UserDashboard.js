// UserDashboard.js - User's home screen with stats and recent requests
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { getUserRequests } from '../services/requestService';
import { getUser } from '../services/authService';

export default function UserDashboard() {
  const user = getUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getUserRequests(user.userId);
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Count by status
  const count = (status) => requests.filter(r => r.status === status).length;

  const stats = [
    { label:'Total Requests', value: requests.length,       color:'#e0f2fe', iconColor:'#0284c7', icon:'📦' },
    { label:'Pending',        value: count('PENDING'),       color:'#fef3c7', iconColor:'#d97706', icon:'⏳' },
    { label:'In Progress',    value: count('IN_PROGRESS'),   color:'#dbeafe', iconColor:'#2563eb', icon:'🚛' },
    { label:'Completed',      value: count('COMPLETED'),     color:'#dcfce7', iconColor:'#16a34a', icon:'✅' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-header">
          <h2>My Dashboard</h2>
          <p>Track and manage your garbage collection requests</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.color }}>
                <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
              </div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #14532d, #16a34a)', border: 'none' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
            <div>
              <h3 style={{ color:'white', fontSize:'1.1rem', fontWeight:700 }}>Need Garbage Pickup?</h3>
              <p style={{ color:'rgba(255,255,255,.75)', fontSize:'.875rem', marginTop:4 }}>Submit a new collection request in seconds</p>
            </div>
            <Link to="/request/new" className="btn" style={{ background:'white', color:'#16a34a', fontWeight:700 }}>
              ➕ New Request
            </Link>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="card-header">
            <div>
              <p className="card-title">Recent Requests</p>
              <p className="card-subtitle">Your latest garbage collection requests</p>
            </div>
            <Link to="/track" className="btn btn-outline btn-sm">View All</Link>
          </div>

          {loading ? <div className="spinner" /> : requests.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize:'3rem', marginBottom:12 }}>♻️</div>
              <h3>No requests yet</h3>
              <p>Submit your first garbage collection request</p>
              <Link to="/request/new" className="btn btn-primary" style={{ marginTop:16 }}>Make Request</Link>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Waste Type</th><th>Address</th><th>Scheduled</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 5).map((r, i) => (
                    <tr key={r.id}>
                      <td style={{ color:'var(--gray-400)', fontSize:'.8rem' }}>#{r.id}</td>
                      <td>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:10, height:10, borderRadius:'50%', background: r.wasteTypeColor || '#666', display:'inline-block' }} />
                          {r.wasteTypeName}
                        </span>
                      </td>
                      <td style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.pickupAddress}</td>
                      <td>{r.scheduledDate}</td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// TrackingPage.js - User sees all their requests and tracks status
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { getUserRequests } from '../services/requestService';
import { getUser } from '../services/authService';

export default function TrackingPage() {
  const user = getUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');

  useEffect(() => {
    getUserRequests(user.userId)
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? requests
    : requests.filter(r => r.status === filter);

  const statuses = ['ALL','PENDING','IN_PROGRESS','COMPLETED','CANCELLED'];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-header">
          <h2>Track My Requests</h2>
          <p>Monitor the status of all your garbage collection requests</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
              {s.replace('_',' ')}
              <span style={{ background:'rgba(255,255,255,.25)', padding:'1px 6px', borderRadius:10, fontSize:'.7rem' }}>
                {s === 'ALL' ? requests.length : requests.filter(r => r.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div style={{ fontSize:'3rem', marginBottom:12 }}>📭</div>
              <h3>No requests found</h3>
              <p>{filter !== 'ALL' ? `No ${filter.toLowerCase().replace('_',' ')} requests` : 'Submit your first request!'}</p>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {filtered.map(r => (
              <div key={r.id} className="card" style={{ padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <span style={{ width:12, height:12, borderRadius:'50%', background: r.wasteTypeColor || '#666', display:'inline-block', flexShrink:0 }} />
                      <span style={{ fontWeight:700, color:'var(--gray-900)' }}>{r.wasteTypeName}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p style={{ color:'var(--gray-600)', fontSize:'.875rem', marginBottom:4 }}>📍 {r.pickupAddress}</p>
                    <p style={{ color:'var(--gray-400)', fontSize:'.8rem' }}>
                      Requested: {r.scheduledDate}
                      {r.collectionDate && <span> · Assigned: {r.collectionDate}</span>}
                    </p>
                    {r.notes && <p style={{ color:'var(--gray-500)', fontSize:'.8rem', marginTop:4 }}>📝 {r.notes}</p>}
                  </div>
                  <div style={{ textAlign:'right', fontSize:'.8rem', color:'var(--gray-400)' }}>
                    <p>#{r.id}</p>
                    {r.collectorName && <p style={{ color:'var(--gray-600)', fontWeight:600 }}>🚛 {r.collectorName}</p>}
                    {r.routeInfo && <p>{r.routeInfo}</p>}
                  </div>
                </div>

                {/* Status Timeline */}
                <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--gray-100)', display:'flex', gap:4, alignItems:'center' }}>
                  {['PENDING','IN_PROGRESS','COMPLETED'].map((s, i) => {
                    const steps = ['PENDING','IN_PROGRESS','COMPLETED','CANCELLED'];
                    const currentIdx = steps.indexOf(r.status);
                    const stepIdx = steps.indexOf(s);
                    const done = currentIdx >= stepIdx && r.status !== 'CANCELLED';
                    return (
                      <React.Fragment key={s}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                          <div style={{ width:20, height:20, borderRadius:'50%', background: done ? '#16a34a' : 'var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.65rem', color: done ? 'white' : 'var(--gray-400)' }}>✓</div>
                          <span style={{ fontSize:'.65rem', color: done ? 'var(--green-700)' : 'var(--gray-400)', fontWeight: done ? 600 : 400, whiteSpace:'nowrap' }}>{s.replace('_',' ')}</span>
                        </div>
                        {i < 2 && <div style={{ flex:1, height:2, background: done && currentIdx > stepIdx ? '#16a34a' : 'var(--gray-200)', marginBottom:14 }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

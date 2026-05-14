// AdminRequestsPage.js - Admin views and manages all garbage requests
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { getAllRequests, updateRequest } from '../services/requestService';
import toast from 'react-hot-toast';

// Modal to assign collector and update status
function UpdateModal({ request, onClose, onSave }) {
  const [form, setForm] = useState({
    status:        request.status,
    collectorName: request.collectorName || '',
    routeInfo:     request.routeInfo     || '',
    collectionDate:request.collectionDate|| '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateRequest(request.id, form);
      if (res.success) { toast.success('Request updated!'); onSave(); }
      else toast.error(res.message || 'Update failed');
    } catch { toast.error('Server error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:16 }}>
      <div className="card" style={{ width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }}>
        <div className="card-header">
          <p className="card-title">Update Request #{request.id}</p>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'var(--gray-500)' }}>✕</button>
        </div>

        {/* Read-only info */}
        <div style={{ background:'var(--gray-50)', borderRadius:8, padding:12, marginBottom:16, fontSize:'.85rem', color:'var(--gray-600)' }}>
          <p><strong>User:</strong> {request.userName} ({request.userEmail})</p>
          <p><strong>Waste:</strong> {request.wasteTypeName}</p>
          <p><strong>Address:</strong> {request.pickupAddress}</p>
          <p><strong>Requested Date:</strong> {request.scheduledDate}</p>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={form.status}
            onChange={e => setForm({...form, status: e.target.value})}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Collector Name</label>
          <input className="form-input" placeholder="e.g. Ramesh Kumar"
            value={form.collectorName}
            onChange={e => setForm({...form, collectorName: e.target.value})} />
        </div>

        <div className="form-group">
          <label className="form-label">Route / Zone Info</label>
          <input className="form-input" placeholder="e.g. Zone A - Route 3"
            value={form.routeInfo}
            onChange={e => setForm({...form, routeInfo: e.target.value})} />
        </div>

        <div className="form-group">
          <label className="form-label">Collection Date</label>
          <input type="date" className="form-input"
            value={form.collectionDate}
            onChange={e => setForm({...form, collectionDate: e.target.value})} />
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');
  const [selected, setSelected] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    getAllRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = filter === 'ALL' ? requests
    : requests.filter(r => r.status === filter);

  const statusFilters = ['ALL','PENDING','IN_PROGRESS','COMPLETED','CANCELLED'];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-header">
          <h2>All Requests</h2>
          <p>Manage garbage collection requests from all users</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
              {s.replace('_',' ')}
              <span style={{ background:'rgba(255,255,255,.25)', padding:'1px 6px', borderRadius:10, fontSize:'.7rem' }}>
                {s === 'ALL' ? requests.length : requests.filter(r => r.status === s).length}
              </span>
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? <div className="spinner" /> : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize:'3rem', marginBottom:12 }}>📭</div>
              <h3>No requests found</h3>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Waste Type</th>
                    <th>Address</th>
                    <th>Req. Date</th>
                    <th>Collector</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontSize:'.8rem', color:'var(--gray-400)' }}>#{r.id}</td>
                      <td>
                        <p style={{ fontWeight:600, color:'var(--gray-800)' }}>{r.userName}</p>
                        <p style={{ fontSize:'.75rem', color:'var(--gray-400)' }}>{r.userEmail}</p>
                      </td>
                      <td>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:10, height:10, borderRadius:'50%', background: r.wasteTypeColor||'#999', display:'inline-block' }} />
                          {r.wasteTypeName}
                        </span>
                      </td>
                      <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'.85rem' }}>{r.pickupAddress}</td>
                      <td style={{ fontSize:'.82rem' }}>{r.scheduledDate}</td>
                      <td style={{ fontSize:'.82rem', color: r.collectorName ? 'var(--gray-700)' : 'var(--gray-400)' }}>
                        {r.collectorName || '—'}
                      </td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <button className="btn btn-outline btn-sm"
                          onClick={() => setSelected(r)}>
                          ✏️ Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Modal */}
        {selected && (
          <UpdateModal
            request={selected}
            onClose={() => setSelected(null)}
            onSave={() => { setSelected(null); fetchAll(); }}
          />
        )}
      </main>
    </div>
  );
}

// AdminUsersPage.js - Admin manages registered users
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getAllUsers, toggleUserStatus } from '../services/requestService';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (userId, name) => {
    try {
      const res = await toggleUserStatus(userId);
      if (res.success) {
        toast.success(`${name}: ${res.isActive ? 'Activated' : 'Deactivated'}`);
        fetchUsers();
      }
    } catch { toast.error('Failed to update user'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-header">
          <h2>Manage Users</h2>
          <p>View and control all registered user accounts</p>
        </div>

        {/* Summary */}
        <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:24 }}>
          {[
            { label:'Total Users',    value: users.length,                           color:'#e0f2fe', icon:'👥' },
            { label:'Active Users',   value: users.filter(u => u.isActive).length,   color:'#dcfce7', icon:'✅' },
            { label:'Inactive Users', value: users.filter(u => !u.isActive).length,  color:'#fee2e2', icon:'🚫' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background:s.color }}>
                <span style={{ fontSize:'1.3rem' }}>{s.icon}</span>
              </div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          {/* Search */}
          <div style={{ marginBottom:16 }}>
            <input
              className="form-input"
              placeholder="🔍  Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth:360 }}
            />
          </div>

          {loading ? <div className="spinner" /> : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No users found</h3>
              <p>{search ? 'Try a different search term' : 'No registered users yet'}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ color:'var(--gray-400)', fontSize:'.8rem' }}>{i + 1}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', background: u.role === 'ADMIN' ? '#16a34a' : '#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'.85rem', flexShrink:0 }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight:600, color:'var(--gray-800)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize:'.875rem' }}>{u.email}</td>
                      <td style={{ fontSize:'.875rem' }}>{u.phone}</td>
                      <td>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'.75rem', fontWeight:600,
                          background: u.role === 'ADMIN' ? '#dcfce7' : '#dbeafe',
                          color:      u.role === 'ADMIN' ? '#15803d'  : '#1e40af' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize:'.82rem', color:'var(--gray-400)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'.75rem', fontWeight:600,
                          background: u.isActive ? '#dcfce7' : '#fee2e2',
                          color:      u.isActive ? '#15803d'  : '#dc2626' }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggle(u.id, u.name)}
                            className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-outline'}`}>
                            {u.isActive ? '🚫 Deactivate' : '✅ Activate'}
                          </button>
                        )}
                      </td>
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

// RequestForm.js - Form to submit a new garbage collection request
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getWasteTypes, createRequest } from '../services/requestService';
import { getUser } from '../services/authService';
import toast from 'react-hot-toast';

export default function RequestForm() {
  const navigate = useNavigate();
  const user = getUser();

  const [wasteTypes, setWasteTypes] = useState([]);
  const [form, setForm] = useState({
    wasteTypeId: '', pickupAddress: '', scheduledDate: '', notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get tomorrow as minimum date (can't schedule in the past)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    getWasteTypes().then(setWasteTypes).catch(() => toast.error('Could not load waste types'));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.wasteTypeId)      errs.wasteTypeId    = 'Please select a waste type';
    if (!form.pickupAddress)    errs.pickupAddress  = 'Pickup address is required';
    if (!form.scheduledDate)    errs.scheduledDate  = 'Please select a date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await createRequest({ ...form, userId: user.userId });
      if (res.success) {
        toast.success('Request submitted! We will collect soon.');
        navigate('/track');
      } else {
        toast.error(res.message || 'Failed to submit request');
      }
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-header">
          <h2>New Collection Request</h2>
          <p>Fill in the details for your garbage pickup</p>
        </div>

        <div className="card" style={{ maxWidth: 680 }}>
          <form onSubmit={handleSubmit}>
            {/* Waste Type Selection */}
            <div className="form-group">
              <label className="form-label">Waste Type *</label>
              <select name="wasteTypeId" className={`form-input ${errors.wasteTypeId ? 'error' : ''}`}
                value={form.wasteTypeId} onChange={handleChange}>
                <option value="">-- Select waste category --</option>
                {wasteTypes.map(wt => (
                  <option key={wt.id} value={wt.id}>{wt.name}</option>
                ))}
              </select>
              {errors.wasteTypeId && <p className="form-error">{errors.wasteTypeId}</p>}
              {/* Show description of selected type */}
              {form.wasteTypeId && wasteTypes.find(w => w.id == form.wasteTypeId) && (
                <p style={{ fontSize:'.8rem', color:'var(--gray-400)', marginTop:6 }}>
                  ℹ️ {wasteTypes.find(w => w.id == form.wasteTypeId)?.description}
                </p>
              )}
            </div>

            {/* Waste Type Quick Guide */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8, marginBottom:20 }}>
              {wasteTypes.map(wt => (
                <div key={wt.id}
                  onClick={() => { setForm({...form, wasteTypeId: String(wt.id)}); setErrors({...errors, wasteTypeId:''}); }}
                  style={{
                    padding:'10px 12px', borderRadius:8, border: form.wasteTypeId == wt.id
                      ? `2px solid ${wt.color}` : '2px solid var(--gray-200)',
                    cursor:'pointer', background: form.wasteTypeId == wt.id ? `${wt.color}15` : 'white',
                    transition:'all .15s'
                  }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background: wt.color, marginBottom:6 }} />
                  <p style={{ fontSize:'.78rem', fontWeight:600, color:'var(--gray-700)' }}>{wt.name}</p>
                </div>
              ))}
            </div>

            {/* Pickup Address */}
            <div className="form-group">
              <label className="form-label">Pickup Address *</label>
              <textarea name="pickupAddress" className={`form-input ${errors.pickupAddress ? 'error' : ''}`}
                placeholder="Enter full pickup address (house no, street, area, city)"
                value={form.pickupAddress} onChange={handleChange} rows={3} />
              {errors.pickupAddress && <p className="form-error">{errors.pickupAddress}</p>}
            </div>

            {/* Scheduled Date */}
            <div className="form-group">
              <label className="form-label">Preferred Pickup Date *</label>
              <input name="scheduledDate" type="date" className={`form-input ${errors.scheduledDate ? 'error' : ''}`}
                min={minDate} value={form.scheduledDate} onChange={handleChange} />
              {errors.scheduledDate && <p className="form-error">{errors.scheduledDate}</p>}
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Additional Notes (optional)</label>
              <textarea name="notes" className="form-input"
                placeholder="Any special instructions, e.g. 'Please collect before 10 AM'"
                value={form.notes} onChange={handleChange} rows={2} />
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                ← Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : '✓ Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

// RegisterPage.js - New user registration
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'', phone:'', address:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Full name is required';
    if (!form.email)          errs.email   = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.phone.match(/^\d{10}$/)) errs.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim()) errs.address = 'Address is required';
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
      const res = await register(form);
      if (res.success) {
        toast.success('Registered successfully! Please login.');
        navigate('/login');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch {
      toast.error('Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type='text', placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input name={name} type={type} className={`form-input ${errors[name] ? 'error' : ''}`}
        placeholder={placeholder} value={form[name]} onChange={handleChange} />
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">♻️</div>
          <div><h1>GarbageMS</h1><p>Smart Waste Management</p></div>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us for smart garbage management</p>
        <form onSubmit={handleSubmit}>
          <Field name="name"     label="Full Name"    placeholder="Rajesh Kumar" />
          <Field name="email"    label="Email Address" type="email" placeholder="rajesh@example.com" />
          <Field name="password" label="Password"     type="password" placeholder="Min 6 characters" />
          <Field name="phone"    label="Phone Number"  placeholder="10-digit mobile number" />
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea name="address" className={`form-input ${errors.address ? 'error' : ''}`}
              placeholder="Your complete address" value={form.address} onChange={handleChange} rows={2} />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : '✓ Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

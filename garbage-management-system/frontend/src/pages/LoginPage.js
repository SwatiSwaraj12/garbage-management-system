// LoginPage.js - User and Admin login
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("STEP 1: Button clicked");
    //console.log("STEP 2:", form);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await login(form.email, form.password);

      console.log("FULL RESPONSE:", res);
      console.log("ROLE:", res.role);
       if (res.success) {
        toast.success(`Welcome back, ${res.name}!`);
        navigate(res.role === 'ADMIN' ? '/admin' : '/dashboard');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch {
      toast.error('Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">♻️</div>
          <div>
            <h1>GarbageMS</h1>
            <p>Smart Waste Management</p>
          </div>
        </div>

        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Enter your credentials to access the platform</p>

        {/* Demo credentials hint 
        <div className="alert alert-success" style={{fontSize:'.8rem', marginBottom:'20px'}}>
          <span>🔑 Admin: <strong>admin@garbage.com</strong> / <strong>admin123</strong></span>
        </div>*/}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••" value={form.password} onChange={handleChange} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : '→ Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

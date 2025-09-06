import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import './Login.css';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const errRef = useRef(null);

  const [formData, setFormData] = useState(() => ({
    email: localStorage.getItem('ac_remember_email') || '',
    password: '',
    role: 'customer',
    remember: !!localStorage.getItem('ac_remember_email'),
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pwStrength, setPwStrength] = useState(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error) errRef.current?.focus();
  }, [error]);

  function strengthFor(pw = '') {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return 'weak';
    if (score === 2) return 'fair';
    if (score === 3) return 'good';
    return 'strong';
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((p) => {
      const next = { ...p, [name]: type === 'checkbox' ? checked : value };
      return next;
    });
    if (name === 'password') setPwStrength(strengthFor(value));
    if (error) setError('');
  }

  function validate() {
    if (!EMAIL_RE.test(formData.email)) return 'Enter a valid email address.';
    if (formData.password.trim().length < 6) return 'Password must be at least 6 characters.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setIsSubmitting(true);
    setError('');

    // persist remember-me email
    if (formData.remember) localStorage.setItem('ac_remember_email', formData.email);
    else localStorage.removeItem('ac_remember_email');

    // fake auth delay (replace with real API)
    await new Promise((r) => setTimeout(r, 900));

    // Demo auth routes (replace logic with real auth)
    const creds = `${formData.email}:${formData.password}`;
    if (creds.startsWith('admin@agriconnect.com')) navigate('/admin/dashboard');
    else if (creds.startsWith('farmer@example.com')) navigate('/farmer/dashboard');
    else if (creds.startsWith('customer@example.com')) navigate('/');
    else {
      setError('Invalid credentials. Use demo creds shown below.');
      setIsSubmitting(false);
      return;
    }
  }

  return (
    <div className="ac-login-page">
      {isSubmitting && <Loader overlay size="small" text="Signing in..." />}
      <div className="ac-container">
        <div className="ac-login-container" aria-labelledby="login-title">
          <header className="ac-login-header">
            <h1 id="login-title" className="ac-login-title">Sign in to AgriConnect</h1>
            <p className="ac-login-subtitle">Access your account — customers, farmers and admin</p>
          </header>

          <form className="ac-login-form" onSubmit={handleSubmit} noValidate>
            <div
              tabIndex={-1}
              ref={errRef}
              aria-live="assertive"
              className={`ac-error-wrap ${error ? 'visible' : ''}`}
            >
              {error && <div className="ac-error-message" role="alert">{error}</div>}
            </div>

            <fieldset className="ac-role-fieldset" aria-label="Role">
              <legend className="ac-visually-hidden">Choose role</legend>
              <div className="ac-role-options" role="radiogroup" aria-label="I am a">
                {[
                  { key: 'customer', label: 'Customer', icon: '🛒' },
                  { key: 'farmer', label: 'Farmer', icon: '🌾' },
                  { key: 'admin', label: 'Admin', icon: '⚙️' },
                ].map((r) => (
                  <label
                    key={r.key}
                    className={`ac-role-option ${formData.role === r.key ? 'active' : ''}`}
                    role="radio"
                    aria-checked={formData.role === r.key}
                    tabIndex={0}
                    onKeyDown={(ev) => {
                      if (ev.key === ' ' || ev.key === 'Enter') {
                        setFormData((p) => ({ ...p, role: r.key }));
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.key}
                      checked={formData.role === r.key}
                      onChange={handleChange}
                      aria-hidden="true"
                    />
                    <span className="ac-role-icon" aria-hidden>{r.icon}</span>
                    <span className="ac-role-label">{r.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="ac-form-group">
              <label htmlFor="email">Email</label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                className="ac-form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={!!error && !EMAIL_RE.test(formData.email)}
                required
              />
            </div>

            <div className="ac-form-group">
              <label htmlFor="password">Password</label>
              <div className="ac-password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="ac-form-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  aria-invalid={!!error && formData.password.length < 6}
                  required
                />
                <button
                  type="button"
                  className="ac-password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {pwStrength && (
                <div className={`ac-pw-strength ${pwStrength}`} aria-hidden="true">
                  <span className="label">Password: </span><strong>{pwStrength}</strong>
                </div>
              )}
            </div>

            <div className="ac-form-row ac-form-options">
              <label className="ac-checkbox">
                <input
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="ac-forgot-password">Forgot?</Link>
            </div>

            <button
              type="submit"
              className="ac-btn ac-btn--primary ac-btn--full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="ac-divider"><span>Or continue with</span></div>

          <div className="ac-social-login">
            <button className="ac-btn ac-btn--social ac-btn--google" type="button" aria-label="Continue with Google">Google</button>
            <button className="ac-btn ac-btn--social ac-btn--facebook" type="button" aria-label="Continue with Facebook">Facebook</button>
          </div>

          <div className="ac-signup-link">
            <p>New here? <Link to="/register" className="ac-link">Create account</Link></p>
          </div>

          <section className="ac-demo-credentials" aria-hidden={isSubmitting}>
            <h4>Demo accounts</h4>
            <ul>
              <li>Admin — admin@agriconnect.com / admin123</li>
              <li>Farmer — farmer@example.com / password123</li>
              <li>Customer — customer@example.com / password123</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

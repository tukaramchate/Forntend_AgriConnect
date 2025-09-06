import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import './Register.css';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwStrength, setPwStrength] = useState(null);

  const getPasswordStrength = (pw) => {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return 'weak';
    if (score <= 2) return 'fair';
    if (score <= 3) return 'good';
    return 'strong';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (name === 'password') {
      setPwStrength(getPasswordStrength(value));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!EMAIL_RE.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // On success, redirect to login with a success message/state
      navigate('/login', { state: { registered: true } });
    }, 1500);
  };

  return (
    <div className="ac-register-page">
      {isSubmitting && <Loader overlay text="Creating your account..." />}
      <div className="ac-container">
        <div className="ac-register-container">
          <div className="ac-register-header">
            <h1 className="ac-register-title">Create an Account</h1>
            <p className="ac-register-subtitle">Join AgriConnect to connect with local farmers.</p>
          </div>

          <form onSubmit={handleSubmit} className="ac-register-form" noValidate>
            <div className="ac-form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" className="ac-form-input" required value={formData.name} onChange={handleChange} aria-invalid={!!errors.name} />
              {errors.name && <div className="ac-field-error">{errors.name}</div>}
            </div>

            <div className="ac-form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" className="ac-form-input" required value={formData.email} onChange={handleChange} aria-invalid={!!errors.email} />
              {errors.email && <div className="ac-field-error">{errors.email}</div>}
            </div>

            <div className="ac-form-group">
              <label>I am a:</label>
              <div className="ac-role-options">
                <label className={`ac-role-option ${formData.role === 'customer' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={handleChange} />
                  <span className="ac-role-label"><span className="ac-role-icon">🛒</span>Customer</span>
                </label>
                <label className={`ac-role-option ${formData.role === 'farmer' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="farmer" checked={formData.role === 'farmer'} onChange={handleChange} />
                  <span className="ac-role-label"><span className="ac-role-icon">🌾</span>Farmer</span>
                </label>
              </div>
            </div>

            <div className="ac-form-group">
              <label htmlFor="password">Password</label>
              <div className="ac-password-input">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" className="ac-form-input" required value={formData.password} onChange={handleChange} aria-invalid={!!errors.password} />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="ac-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {pwStrength && (
                <div className={`ac-pw-strength ${pwStrength}`} aria-hidden="true">
                  <div className="ac-pw-strength-bar" style={{ width: `${{ weak: 25, fair: 50, good: 75, strong: 100 }[pwStrength]}%` }}></div>
                </div>
              )}
              {errors.password && <div className="ac-field-error">{errors.password}</div>}
            </div>

            <div className="ac-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" className="ac-form-input" required value={formData.confirmPassword} onChange={handleChange} aria-invalid={!!errors.confirmPassword} />
              {errors.confirmPassword && <div className="ac-field-error">{errors.confirmPassword}</div>}
            </div>

            <div className="ac-form-group">
              <label className="ac-checkbox">
                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} aria-invalid={!!errors.agreedToTerms} />
                <span>I agree to the <Link to="/terms" className="ac-link">Terms and Conditions</Link></span>
              </label>
              {errors.agreedToTerms && <div className="ac-field-error">{errors.agreedToTerms}</div>}
            </div>

            <button className="ac-btn ac-btn--primary ac-btn--full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="ac-signin-link">
            <p>
              Already have an account? <Link to="/login" className="ac-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
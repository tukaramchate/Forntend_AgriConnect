import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
// Tailwind-only styling

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
    if (formData.password.trim().length < 6)
      return 'Password must be at least 6 characters.';
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
    if (formData.remember)
      localStorage.setItem('ac_remember_email', formData.email);
    else localStorage.removeItem('ac_remember_email');

    // fake auth delay (replace with real API)
    await new Promise((r) => setTimeout(r, 900));

    // Demo auth routes (replace logic with real auth)
    const creds = `${formData.email}:${formData.password}`;
    if (creds.startsWith('admin@agriconnect.com')) navigate('/admin/dashboard');
    else if (creds.startsWith('farmer@example.com'))
      navigate('/farmer/dashboard');
    else if (creds.startsWith('customer@example.com')) navigate('/');
    else {
      setError('Invalid credentials. Use demo creds shown below.');
      setIsSubmitting(false);
      return;
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      {isSubmitting && <Loader overlay size='small' text='Signing in...' />}
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-md'>
        <h2 className='mb-6 text-2xl font-bold text-center text-secondary-900'>
          Login to AgriConnect
        </h2>
        {error && <div className='mb-4 text-red-600 text-center'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              ref={emailRef}
              type='email'
              name='email'
              className='mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600'
              placeholder='you@example.com'
              value={formData.email}
              onChange={handleChange}
              autoComplete='email'
              aria-invalid={!!error && !EMAIL_RE.test(formData.email)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='ac-password-input'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                className='mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600'
                placeholder='Enter password'
                value={formData.password}
                onChange={handleChange}
                autoComplete='current-password'
                aria-invalid={!!error && formData.password.length < 6}
                required
              />
              <button
                type='button'
                className='ac-password-toggle'
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {pwStrength && (
              <div
                className={`ac-pw-strength ${pwStrength}`}
                aria-hidden='true'
              >
                <span className='label'>Password: </span>
                <strong>{pwStrength}</strong>
              </div>
            )}
          </div>
          <div className='mt-6 flex items-center justify-between'>
            <div className='text-sm'>
              <Link
                to='/forgot-password'
                className='font-medium text-primary-600 hover:text-primary-500'
              >
                Forgot password?
              </Link>
            </div>
            <div className='text-sm'>
              <Link
                to='/register'
                className='font-medium text-primary-600 hover:text-primary-500'
              >
                Create an account
              </Link>
            </div>
          </div>
          <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className='mt-6 border-t pt-6 text-center'>
          <p className='text-sm text-gray-500'>Or login with</p>
          <div className='mt-4 flex justify-center space-x-4'>
            <button
              className='p-2 rounded-full border border-gray-300 hover:bg-gray-50'
              title='Login with Google'
            >
              <img
                src='/path/to/google-icon.svg'
                alt='Google'
                className='h-6 w-6'
              />
            </button>
            <button
              className='p-2 rounded-full border border-gray-300 hover:bg-gray-50'
              title='Login with Facebook'
            >
              <img
                src='/path/to/facebook-icon.svg'
                alt='Facebook'
                className='h-6 w-6'
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // On success, redirect to login with a success message/state
      navigate('/login', { state: { registered: true } });
    }, 1500);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      {loading && <Loader overlay text='Creating your account...' />}
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-md'>
        <h2 className='mb-6 text-2xl font-bold text-center text-secondary-900'>
          Create an Account
        </h2>
        {error && <div className='mb-4 text-red-600 text-center'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-5' noValidate>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              name='name'
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-600 focus:border-primary-600'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              name='email'
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-600 focus:border-primary-600'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              name='password'
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-600 focus:border-primary-600'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Confirm Password
            </label>
            <input
              type='password'
              name='confirmPassword'
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-600 focus:border-primary-600'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full flex justify-center py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-primary-600 hover:text-primary-500'
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

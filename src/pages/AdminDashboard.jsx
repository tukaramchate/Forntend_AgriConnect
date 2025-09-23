import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const stats = [
    { label: 'Pending Farmer Verifications', value: 3 },
    { label: 'Products Awaiting Approval', value: 8 },
    { label: 'Open Disputes', value: 1 },
  ];

  return (
    <div className='min-h-screen bg-secondary-50 p-8'>
      <h1 className='text-3xl font-bold text-secondary-900 mb-6'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Analytics Cards */}
        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Users</h2>
          <p className='text-3xl'>0</p>
        </div>
        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-xl font-semibold mb-2'>Total Sales</h2>
          <p className='text-3xl'>0</p>
        </div>
        {/* Management Cards */}
        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-xl font-semibold mb-2'>Manage Products</h2>
          <p className='text-secondary-600'>Edit, update, or remove products.</p>
        </div>
        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-xl font-semibold mb-2'>Manage Orders</h2>
          <p className='text-secondary-600'>View and process orders.</p>
        </div>
      </div>

      <div className='ac-summary-stats' style={{ marginTop: '1rem' }}>
        {stats.map((s, idx) => (
          <div key={idx} className='ac-stat'>
            <span className='ac-stat-number'>{s.value}</span>
            <span className='ac-stat-label'>{s.label}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <Link className='ac-btn ac-btn--outline' to='/admin/farmers'>
          Verify Farmers
        </Link>
        <Link className='ac-btn ac-btn--outline' to='/admin/products'>
          Manage Products
        </Link>
        <Link className='ac-btn ac-btn--outline' to='/orders'>
          Monitor Orders
        </Link>
        <Link className='ac-btn ac-btn--outline' to='/admin/reports'>
          View Reports
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

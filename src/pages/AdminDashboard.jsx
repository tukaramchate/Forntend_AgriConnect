import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const stats = [
    { label: 'Pending Farmer Verifications', value: 3 },
    { label: 'Products Awaiting Approval', value: 8 },
    { label: 'Open Disputes', value: 1 },
  ];

  return (
    <div className="ac-container">
      <h1 className="ac-page-title">Admin Dashboard</h1>
      <p className="ac-page-subtitle">Manage farmers, products, and orders</p>

      <div className="ac-summary-stats" style={{ marginTop: '1rem' }}>
        {stats.map((s, idx) => (
          <div key={idx} className="ac-stat">
            <span className="ac-stat-number">{s.value}</span>
            <span className="ac-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <Link className="ac-btn ac-btn--outline" to="/admin/farmers">Verify Farmers</Link>
        <Link className="ac-btn ac-btn--outline" to="/admin/products">Manage Products</Link>
        <Link className="ac-btn ac-btn--outline" to="/orders">Monitor Orders</Link>
        <Link className="ac-btn ac-btn--outline" to="/admin/reports">View Reports</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import './FarmerDashboard.css';

function FarmerDashboard() {
  const stats = [
    { label: "Today's Orders", value: 5, hint: 'New' },
    { label: 'Total Sales (₹)', value: 12450, hint: 'This month' },
    { label: 'Low Stock Items', value: 2, hint: 'Reorder soon' },
  ];

  const topProducts = [
    { name: 'Fresh Milk', sales: 120 },
    { name: 'Organic Tomatoes', sales: 98 },
    { name: 'Pure Honey', sales: 54 },
  ];

  const recentOrders = [
    { id: 'OD-1023', buyer: 'Ramesh', total: 420, status: 'Pending' },
    { id: 'OD-1021', buyer: 'Soniya', total: 760, status: 'Delivered' },
    { id: 'OD-1018', buyer: 'Amit', total: 190, status: 'Out for delivery' },
  ];

  const lowStock = [
    { id: 'P-33', name: 'Organic Turmeric', stock: 3 },
    { id: 'P-47', name: 'Green Chilli', stock: 5 },
  ];

  return (
    <div className="ac-container ac-farmer-dashboard">
      <header className="ac-page-head">
        <div>
          <h1 className="ac-page-title">Farmer Dashboard</h1>
          <p className="ac-page-subtitle">Overview of your sales and products</p>
        </div>

        <div className="ac-page-actions">
          <Link to="/products/new" className="ac-btn ac-btn--primary">Add Product</Link>
          <Link to="/products" className="ac-btn ac-btn--ghost">Manage Products</Link>
        </div>
      </header>

      <section className="ac-summary-stats" aria-label="Summary statistics">
        {stats.map((s, i) => (
          <div key={i} className="ac-stat" tabIndex={0}>
            <div className="ac-stat-number">
              {typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}
            </div>
            <div className="ac-stat-label">{s.label}</div>
            <div className="ac-stat-hint">{s.hint}</div>
          </div>
        ))}
      </section>

      <div className="ac-dashboard-grid">
        <main className="ac-main-col">
          <section className="ac-card">
            <div className="ac-card-head">
              <h3>Top Products</h3>
              <Link to="/products" className="ac-link-sm">View all</Link>
            </div>

            <ul className="ac-top-products">
              {topProducts.map((p, idx) => (
                <li key={idx} className="ac-top-product">
                  <span>{p.name}</span>
                  <strong>{p.sales}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="ac-card" aria-labelledby="recent-orders-title">
            <div className="ac-card-head">
              <h3 id="recent-orders-title">Recent Orders</h3>
              <Link to="/orders" className="ac-link-sm">Manage orders</Link>
            </div>

            <div className="ac-recent-orders">
              <table className="ac-table" role="table" aria-label="Recent orders">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Buyer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td><Link to={`/orders/${o.id}`} className="ac-order-link">{o.id}</Link></td>
                      <td>{o.buyer}</td>
                      <td>₹{o.total}</td>
                      <td><span className={`ac-badge-status ${o.status === 'Delivered' ? 'delivered' : o.status === 'Pending' ? 'pending' : 'info'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <aside className="ac-side-col" aria-label="Side panel">
          <section className="ac-card">
            <div className="ac-card-head">
              <h3>Low Stock</h3>
              <Link to="/products" className="ac-link-sm">Restock</Link>
            </div>

            <ul className="ac-low-stock">
              {lowStock.map((p) => (
                <li key={p.id} className="ac-low-stock-item">
                  <span>{p.name}</span>
                  <span className="ac-low-stock-count">{p.stock}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="ac-card ac-quick-actions">
            <h3>Quick Actions</h3>
            <div className="ac-quick-actions-grid">
              <Link to="/products/new" className="ac-btn ac-btn--primary">Add Product</Link>
              <Link to="/orders" className="ac-btn ac-btn--ghost">View Orders</Link>
              <Link to="/inventory" className="ac-btn ac-btn--ghost">Manage Inventory</Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default FarmerDashboard;
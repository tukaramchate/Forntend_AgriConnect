import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-secondary-50 p-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-4">
        Farmer Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-2xl">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Orders Received</h2>
          <p className="text-2xl">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Pending Deliveries</h2>
          <p className="text-2xl">0</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-bold mb-4">Performance Chart</h3>
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          Chart Placeholder
        </div>
      </div>

      <section className='ac-summary-stats' aria-label='Summary statistics'>
        {stats.map((s, i) => (
          <div key={i} className='ac-stat' tabIndex={0}>
            <div className='ac-stat-number'>
              {typeof s.value === 'number'
                ? s.value.toLocaleString('en-IN')
                : s.value}
            </div>
            <div className='ac-stat-label'>{s.label}</div>
            <div className='ac-stat-hint'>{s.hint}</div>
          </div>
        ))}
      </section>

      <div className='ac-dashboard-grid'>
        <main className='ac-main-col'>
          <section className='ac-card'>
            <div className='ac-card-head'>
              <h3>Top Products</h3>
              <Link to='/products' className='ac-link-sm'>
                View all
              </Link>
            </div>

            <ul className='ac-top-products'>
              {topProducts.map((p, idx) => (
                <li key={idx} className='ac-top-product'>
                  <span>{p.name}</span>
                  <strong>{p.sales}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className='ac-card' aria-labelledby='recent-orders-title'>
            <div className='ac-card-head'>
              <h3 id='recent-orders-title'>Recent Orders</h3>
              <Link to='/orders' className='ac-link-sm'>
                Manage orders
              </Link>
            </div>

            <div className='ac-recent-orders'>
              <table
                className='ac-table'
                role='table'
                aria-label='Recent orders'
              >
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
                      <td>
                        <Link to={`/orders/${o.id}`} className='ac-order-link'>
                          {o.id}
                        </Link>
                      </td>
                      <td>{o.buyer}</td>
                      <td>₹{o.total}</td>
                      <td>
                        <span
                          className={`ac-badge-status ${o.status === 'Delivered' ? 'delivered' : o.status === 'Pending' ? 'pending' : 'info'}`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <aside className='ac-side-col' aria-label='Side panel'>
          <section className='ac-card'>
            <div className='ac-card-head'>
              <h3>Low Stock</h3>
              <Link to='/products' className='ac-link-sm'>
                Restock
              </Link>
            </div>

            <ul className='ac-low-stock'>
              {lowStock.map((p) => (
                <li key={p.id} className='ac-low-stock-item'>
                  <span>{p.name}</span>
                  <span className='ac-low-stock-count'>{p.stock}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className='ac-card ac-quick-actions'>
            <h3>Quick Actions</h3>
            <div className='ac-quick-actions-grid'>
              <Link to='/products/new' className='ac-btn ac-btn--primary'>
                Add Product
              </Link>
              <Link to='/orders' className='ac-btn ac-btn--ghost'>
                View Orders
              </Link>
              <Link to='/inventory' className='ac-btn ac-btn--ghost'>
                Manage Inventory
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default FarmerDashboard;

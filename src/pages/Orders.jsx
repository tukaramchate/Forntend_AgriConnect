import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import './Orders.css';

// Mock orders data for development
const mockOrders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "delivered",
    total: 200,
    items: [
      { name: "Fresh Organic Tomatoes", quantity: 2, price: 45, unit: "kg" },
      { name: "Fresh Milk", quantity: 1, price: 60, unit: "liter" }
    ],
    deliveryAddress: "123 Main St, City, State - 123456",
    paymentMethod: "Cash on Delivery",
    estimatedDelivery: "2024-01-16",
    actualDelivery: "2024-01-16"
  },
  {
    id: "ORD002",
    date: "2024-01-10",
    status: "shipped",
    total: 150,
    items: [
      { name: "Sweet Corn", quantity: 3, price: 30, unit: "kg" }
    ],
    deliveryAddress: "456 Oak Ave, City, State - 123456",
    paymentMethod: "UPI",
    estimatedDelivery: "2024-01-12",
    actualDelivery: null
  },
  {
    id: "ORD003",
    date: "2024-01-05",
    status: "pending",
    total: 300,
    items: [
      { name: "Organic Apples", quantity: 2, price: 120, unit: "kg" },
      { name: "Basmati Rice", quantity: 1, price: 85, unit: "kg" }
    ],
    deliveryAddress: "789 Pine Rd, City, State - 123456",
    paymentMethod: "Credit Card",
    estimatedDelivery: "2024-01-08",
    actualDelivery: null
  }
];

const orderStatuses = {
  pending: { label: "Order Placed", color: "#ff9f00", icon: "📋" },
  confirmed: { label: "Confirmed", color: "#2874f0", icon: "✅" },
  processing: { label: "Processing", color: "#9d4edd", icon: "⚙️" },
  shipped: { label: "Out for Delivery", color: "#2962ff", icon: "🚚" },
  delivered: { label: "Delivered", color: "#388e3c", icon: "📦" },
  cancelled: { label: "Cancelled", color: "#d32f2f", icon: "❌" }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "all",
    timeRange: "all" // all, last30, last90, thisYear
  });

  useEffect(() => {
    // Simulate API fetch
    const t = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Status filter
    if (filter.status !== "all") {
      filtered = filtered.filter(order => order.status === filter.status);
    }
    
    // Time range filter
    const now = new Date();
    switch (filter.timeRange) {
      case "last30":
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.date);
          return (now - orderDate) <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
      case "last90":
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.date);
          return (now - orderDate) <= 90 * 24 * 60 * 60 * 1000;
        });
        break;
      case "thisYear":
        filtered = filtered.filter(order => {
          return new Date(order.date).getFullYear() === now.getFullYear();
        });
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      relative: getRelativeTimeString(date)
    };
  };

  const getRelativeTimeString = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return null;
  };

  if (isLoading) {
    return <Loader text="Loading your orders..." />;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="ac-orders-page">
      <div className="ac-container">
        <div className="ac-orders-header">
          <div className="ac-orders-title">
            <h1>My Orders</h1>
            <p>{orders.length} orders placed</p>
          </div>

          <div className="ac-orders-filters">
            <select
              value={filter.timeRange}
              onChange={(e) => setFilter(f => ({ ...f, timeRange: e.target.value }))}
              className="ac-select"
            >
              <option value="all">All Time</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
              className="ac-select"
            >
              <option value="all">All Orders</option>
              {Object.entries(orderStatuses).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="ac-orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="ac-order-card">
                <div className="ac-order-top">
                  <div className="ac-order-meta">
                    <div className="ac-order-id">
                      ORDER #{order.id}
                      {getRelativeTimeString(new Date(order.date)) && (
                        <span className="ac-order-relative-time">
                          {getRelativeTimeString(new Date(order.date))}
                        </span>
                      )}
                    </div>
                    <div className="ac-order-date">{formatDate(order.date).full}</div>
                  </div>
                  <div className={`ac-order-status ac-status-${order.status}`}>
                    <span className="ac-status-icon">{orderStatuses[order.status].icon}</span>
                    <span>{orderStatuses[order.status].label}</span>
                  </div>
                </div>

                <div className="ac-order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="ac-order-item">
                      <div className="ac-item-image">
                        {/* Placeholder for product image */}
                        <div className="ac-item-img-placeholder" />
                      </div>
                      <div className="ac-item-info">
                        <h3>{item.name}</h3>
                        <div className="ac-item-meta">
                          <span>Qty: {item.quantity} {item.unit}</span>
                          <span>₹{item.price} per {item.unit}</span>
                        </div>
                      </div>
                      <div className="ac-item-price">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="ac-order-summary">
                  <div className="ac-summary-row">
                    <span>Items Total</span>
                    <span>₹{order.total}</span>
                  </div>
                  <div className="ac-summary-row total">
                    <span>Order Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                <div className="ac-order-actions">
                  <Link to={`/orders/${order.id}`} className="ac-btn ac-btn--primary">
                    View Order Details
                  </Link>
                  
                  {order.status === "delivered" && (
                    <button className="ac-btn ac-btn--outline">Write Review</button>
                  )}
                  
                  {order.status === "pending" && (
                    <button className="ac-btn ac-btn--danger">Cancel Order</button>
                  )}
                  
                  {order.status === "shipped" && (
                    <button className="ac-btn ac-btn--primary">Track Package</button>
                  )}

                  <button className="ac-btn ac-btn--outline">Need Help?</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ac-empty-orders">
            <div className="ac-empty-orders__icon">🛍️</div>
            <h2>No orders found</h2>
            <p>
              {filter.status === "all" 
                ? "Looks like you haven't placed any orders yet."
                : `No ${orderStatuses[filter.status].label.toLowerCase()} orders found.`}
            </p>
            <Link to="/products" className="ac-btn ac-btn--primary">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

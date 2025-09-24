import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import DashboardTable from '../components/dashboard/DashboardTable';
import ChartCard from '../components/dashboard/ChartCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';

const AdminDashboardEnhanced = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const adminStats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      trend: 'vs last month',
      icon: '/src/assets/icons/user.svg'
    },
    {
      title: 'Active Farmers',
      value: '342',
      change: '+8.2%',
      changeType: 'positive',
      trend: 'vs last month',
      icon: '/src/assets/icons/home.svg'
    },
    {
      title: 'Total Revenue',
      value: '₹8,45,670',
      change: '+15.8%',
      changeType: 'positive',
      trend: 'vs last month',
      icon: '/src/assets/icons/credit-card.svg'
    },
    {
      title: 'Platform Health',
      value: '99.2%',
      change: '+0.3%',
      changeType: 'positive',
      trend: 'uptime',
      icon: '/src/assets/icons/grid.svg'
    }
  ];

  const pendingApprovals = [
    {
      id: 'F-1001',
      farmer_name: 'Sunita Devi',
      farm_location: 'Pune, Maharashtra',
      submitted_date: '2024-03-20',
      status: 'Pending Review',
      documents: 'Complete'
    },
    {
      id: 'F-1002',
      farmer_name: 'Vikram Singh',
      farm_location: 'Jaipur, Rajasthan',
      submitted_date: '2024-03-19',
      status: 'Under Verification',
      documents: 'Incomplete'
    },
    {
      id: 'F-1003',
      farmer_name: 'Meera Patel',
      farm_location: 'Ahmedabad, Gujarat',
      submitted_date: '2024-03-18',
      status: 'Pending Review',
      documents: 'Complete'
    }
  ];

  const recentOrders = [
    {
      order_id: 'OD-1045',
      customer: 'Priya Sharma',
      farmer: 'Ramesh Kumar',
      amount: '₹1,280',
      status: 'Processing',
      date: '2024-03-20'
    },
    {
      order_id: 'OD-1044',
      customer: 'Rahul Gupta',
      farmer: 'Sunita Devi',
      amount: '₹650',
      status: 'Delivered',
      date: '2024-03-20'
    },
    {
      order_id: 'OD-1043',
      customer: 'Anjali Singh',
      farmer: 'Vikram Singh',
      amount: '₹890',
      status: 'In Transit',
      date: '2024-03-19'
    }
  ];

  const supportTickets = [
    {
      ticket_id: 'T-5001',
      user: 'Priya Sharma',
      subject: 'Payment not processed',
      priority: 'High',
      status: 'Open',
      created: '2 hours ago'
    },
    {
      ticket_id: 'T-5000',
      user: 'Ramesh Kumar',
      subject: 'Product listing issue',
      priority: 'Medium',
      status: 'In Progress',
      created: '4 hours ago'
    },
    {
      ticket_id: 'T-4999',
      user: 'Sunita Devi',
      subject: 'Profile verification',
      priority: 'Low',
      status: 'Resolved',
      created: '1 day ago'
    }
  ];

  const activities = [
    {
      type: 'user',
      title: 'New Farmer Registration',
      description: 'Sunita Devi from Pune submitted farmer verification documents',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: { label: 'Review Application', onClick: () => {} }
    },
    {
      type: 'alert',
      title: 'High Priority Support ticket',
      description: 'Payment processing issue reported by Priya Sharma',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: { label: 'View Ticket', onClick: () => {} }
    },
    {
      type: 'order',
      title: 'Large Order Alert',
      description: 'Order #OD-1045 worth ₹1,280 requires attention',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      action: { label: 'Review Order', onClick: () => {} }
    },
    {
      type: 'user',
      title: 'Farmer Approved',
      description: 'Meera Patel\'s farmer verification has been approved',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  const quickActions = [
    {
      title: 'Review Applications',
      description: 'Farmer verifications',
      icon: '/src/assets/icons/clipboard.svg',
      onClick: () => setActiveTab('farmers')
    },
    {
      title: 'System Analytics',
      description: 'Platform insights',
      icon: '/src/assets/icons/grid.svg',
      onClick: () => setActiveTab('analytics')
    },
    {
      title: 'Support Center',
      description: 'Help desk tickets',
      icon: '/src/assets/icons/help-circle.svg',
      onClick: () => setActiveTab('support')
    },
    {
      title: 'User Management',
      description: 'Manage all users',
      icon: '/src/assets/icons/user.svg',
      onClick: () => setActiveTab('users')
    }
  ];

  const approvalHeaders = ['ID', 'Farmer Name', 'Farm Location', 'Submitted Date', 'Status', 'Documents'];
  const approvalActions = [
    {
      label: 'Review',
      onClick: (farmer) => console.log('Review farmer:', farmer),
      icon: '/src/assets/icons/eye.svg'
    },
    {
      label: 'Approve',
      onClick: (farmer) => console.log('Approve farmer:', farmer),
      icon: '/src/assets/icons/user.svg'
    }
  ];

  const orderHeaders = ['Order ID', 'Customer', 'Farmer', 'Amount', 'Status', 'Date'];
  const orderActions = [
    {
      label: 'View',
      onClick: (order) => console.log('View order:', order),
      icon: '/src/assets/icons/eye.svg'
    },
    {
      label: 'Manage',
      onClick: (order) => console.log('Manage order:', order),
      icon: '/src/assets/icons/edit-2.svg'
    }
  ];

  const supportHeaders = ['Ticket ID', 'User', 'Subject', 'Priority', 'Status', 'Created'];
  const supportActions = [
    {
      label: 'View',
      onClick: (ticket) => console.log('View ticket:', ticket),
      icon: '/src/assets/icons/eye.svg'
    },
    {
      label: 'Assign',
      onClick: (ticket) => console.log('Assign ticket:', ticket),
      icon: '/src/assets/icons/user.svg'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'farmers', label: 'Farmers' },
    { id: 'orders', label: 'Orders' },
    { id: 'users', label: 'Users' },
    { id: 'support', label: 'Support' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
                <p className="text-secondary-600 mt-1">Manage your platform and monitor system health</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ All Systems Operational
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                  System Settings
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mt-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-8">
                {/* Pending Farmer Approvals */}
                <DashboardTable
                  title="Pending Farmer Approvals"
                  headers={approvalHeaders}
                  data={pendingApprovals}
                  actions={approvalActions}
                  emptyMessage="No pending farmer approvals."
                />

                {/* Platform Analytics */}
                <ChartCard 
                  title="Platform Growth" 
                  subtitle="User acquisition and revenue trends"
                  actions={[
                    { label: '30D', onClick: () => {} },
                    { label: '3M', onClick: () => {} },
                    { label: '1Y', onClick: () => {} }
                  ]}
                >
                  <div className="h-64 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-secondary-600 mb-2">Platform Analytics Chart</p>
                      <p className="text-sm text-secondary-500">User growth and revenue visualization</p>
                    </div>
                  </div>
                </ChartCard>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-8">
                <QuickActions actions={quickActions} />
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Farmer Management</h2>
              <div className="flex space-x-4">
                <select className="border border-secondary-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Applications</option>
                  <option>Pending Review</option>
                  <option>Under Verification</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            <DashboardTable
              title=""
              headers={approvalHeaders}
              data={pendingApprovals}
              actions={approvalActions}
              emptyMessage="No farmer applications found for the selected filter."
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Order Management</h2>
              <div className="flex space-x-4">
                <select className="border border-secondary-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Orders</option>
                  <option>Processing</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                  <option>Issues</option>
                </select>
              </div>
            </div>
            <DashboardTable
              title=""
              headers={orderHeaders}
              data={recentOrders}
              actions={orderActions}
              emptyMessage="No orders found for the selected filter."
            />
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Support Center</h2>
              <div className="flex space-x-4">
                <select className="border border-secondary-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Tickets</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>High Priority</option>
                </select>
              </div>
            </div>
            <DashboardTable
              title=""
              headers={supportHeaders}
              data={supportTickets}
              actions={supportActions}
              emptyMessage="No support tickets found for the selected filter."
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-secondary-900">Platform Analytics</h2>
            
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartCard title="User Growth" subtitle="New user registrations over time">
                <div className="h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <p className="text-secondary-600">User Growth Chart</p>
                </div>
              </ChartCard>
              
              <ChartCard title="Revenue Analytics" subtitle="Platform revenue breakdown">
                <div className="h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <p className="text-secondary-600">Revenue Chart</p>
                </div>
              </ChartCard>
              
              <ChartCard title="Geographic Distribution" subtitle="Users by location">
                <div className="h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <p className="text-secondary-600">Geographic Chart</p>
                </div>
              </ChartCard>
              
              <ChartCard title="System Performance" subtitle="Platform health metrics">
                <div className="h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <p className="text-secondary-600">Performance Metrics</p>
                </div>
              </ChartCard>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="text-center py-12">
            <img src="/src/assets/icons/user.svg" alt="" className="w-16 h-16 mx-auto opacity-50 mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">User Management</h3>
            <p className="text-secondary-600 mb-6">Comprehensive user management tools and analytics</p>
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
              View All Users
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;
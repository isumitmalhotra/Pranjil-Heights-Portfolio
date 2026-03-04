import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, FolderOpen, MessageSquare, Quote, Users, Star,
  Mail, TrendingUp, TrendingDown, Eye, Calendar, ArrowRight,
  Loader2, RefreshCw
} from 'lucide-react';
import { dashboardAPI } from '../services/adminApi';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, link }) => {
  const colorClasses = {
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <Link to={link} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
};

const RecentItem = ({ icon: Icon, title, subtitle, time, status }) => {
  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
      </div>
      <div className="text-right">
        {status && (
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        )}
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardAPI.getStats();
      // Handle both wrapped { success, data } and direct response formats
      const data = response?.data || response;
      setStats(data);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Products"
          value={stats?.products || 0}
          icon={Package}
          color="amber"
          link="/admin/products"
        />
        <StatCard
          title="Categories"
          value={stats?.categories || 0}
          icon={FolderOpen}
          color="blue"
          link="/admin/categories"
        />
        <StatCard
          title="Contact Messages"
          value={stats?.contacts || 0}
          icon={MessageSquare}
          color="green"
          link="/admin/contacts"
        />
        <StatCard
          title="Quote Requests"
          value={stats?.quotes || 0}
          icon={Quote}
          color="purple"
          link="/admin/quotes"
        />
        <StatCard
          title="Dealer Applications"
          value={stats?.dealers || 0}
          icon={Users}
          color="orange"
          link="/admin/dealers"
        />
        <StatCard
          title="Testimonials"
          value={stats?.testimonials || 0}
          icon={Star}
          color="pink"
          link="/admin/testimonials"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Contact Messages</h2>
            <Link to="/admin/contacts" className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-2">
            {stats?.recentContacts?.length > 0 ? (
              stats.recentContacts.map((contact) => (
                <RecentItem
                  key={contact.id}
                  icon={MessageSquare}
                  title={contact.name}
                  subtitle={contact.subject}
                  time={formatTime(contact.createdAt)}
                  status={contact.status?.toLowerCase()}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent contacts</p>
            )}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Quote Requests</h2>
            <Link to="/admin/quotes" className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-2">
            {stats?.recentQuotes?.length > 0 ? (
              stats.recentQuotes.map((quote) => (
                <RecentItem
                  key={quote.id}
                  icon={Quote}
                  title={quote.name}
                  subtitle={quote.projectType || 'General Inquiry'}
                  time={formatTime(quote.createdAt)}
                  status={quote.status?.toLowerCase()}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent quotes</p>
            )}
          </div>
        </div>

        {/* Recent Dealer Applications */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Dealer Applications</h2>
            <Link to="/admin/dealers" className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-2">
            {stats?.recentDealers?.length > 0 ? (
              stats.recentDealers.map((dealer) => (
                <RecentItem
                  key={dealer.id}
                  icon={Users}
                  title={dealer.companyName}
                  subtitle={dealer.city}
                  time={formatTime(dealer.createdAt)}
                  status={dealer.status?.toLowerCase()}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent applications</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Newsletter Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Newsletter Subscribers</h2>
            <Link to="/admin/newsletter" className="text-amber-600 hover:text-amber-700 text-sm">
              Manage →
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats?.newsletterSubscribers || 0}</p>
              <p className="text-sm text-gray-500">Active subscribers</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products?action=new"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
            >
              + Add Product
            </Link>
            <Link
              to="/admin/categories?action=new"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              + Add Category
            </Link>
            <Link
              to="/admin/testimonials?action=new"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
            >
              + Add Testimonial
            </Link>
            <Link
              to="/"
              target="_blank"
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

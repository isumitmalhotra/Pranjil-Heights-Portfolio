import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Globe, Database,
  Save, Loader2, Eye, EyeOff, CheckCircle, RefreshCw
} from 'lucide-react';
import { authAPI, settingsAPI } from '../services/adminApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    new_contact: true,
    new_quote: true,
    new_dealer: true,
    newsletter: true
  });
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const [systemInfo, setSystemInfo] = useState(null);
  const [systemLoading, setSystemLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System Info', icon: Database }
  ];

  // Load notification preferences when tab is active
  useEffect(() => {
    if (activeTab === 'notifications') {
      loadNotificationPreferences();
    }
  }, [activeTab]);

  // Load system info when tab is active
  useEffect(() => {
    if (activeTab === 'system') {
      loadSystemInfo();
    }
  }, [activeTab]);

  const loadNotificationPreferences = async () => {
    setNotificationsLoading(true);
    try {
      const response = await settingsAPI.getNotificationPreferences();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const loadSystemInfo = async () => {
    setSystemLoading(true);
    try {
      const response = await settingsAPI.getSystemInfo();
      setSystemInfo(response.data);
    } catch (error) {
      console.error('Failed to load system info:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.updateProfile({
        name: profileData.name,
        email: profileData.email
      });
      
      // Update user in context if available
      if (updateUser && response.data?.user) {
        updateUser(response.data.user);
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await settingsAPI.updateNotificationPreferences(notifications);
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and system settings</p>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-50 text-amber-600 border-l-4 border-amber-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                  <p className="text-sm text-gray-500 mb-6">Update your account profile information.</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user?.name || 'Admin User'}</h3>
                    <p className="text-sm text-gray-500">{user?.role || 'Administrator'}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
                  <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure.</p>
                </div>

                <div className="max-w-md space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Change Password
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                  <p className="text-sm text-gray-500 mb-6">Choose how you want to receive notifications.</p>
                </div>

                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {[
                        { id: 'new_contact', label: 'New Contact Messages', description: 'Receive email when someone submits a contact form' },
                        { id: 'new_quote', label: 'New Quote Requests', description: 'Receive email for new quote requests' },
                        { id: 'new_dealer', label: 'Dealer Applications', description: 'Receive email for new dealer applications' },
                        { id: 'newsletter', label: 'Newsletter Signups', description: 'Receive email when someone subscribes to newsletter' }
                      ].map(notification => (
                        <label
                          key={notification.id}
                          className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={notifications[notification.id] || false}
                            onChange={() => handleNotificationChange(notification.id)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{notification.label}</p>
                            <p className="text-sm text-gray-500">{notification.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <button
                        onClick={handleSaveNotifications}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Preferences
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* System Info Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                  <p className="text-sm text-gray-500 mb-6">Technical information about your installation.</p>
                </div>

                {systemLoading && !systemInfo ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        onClick={loadSystemInfo}
                        disabled={systemLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${systemLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Application', value: systemInfo?.application || 'Pranijheightsindia Admin' },
                        { label: 'Version', value: systemInfo?.version || '1.0.0' },
                        { label: 'Backend', value: systemInfo?.backend || 'Node.js + Express' },
                        { label: 'Database', value: systemInfo?.database || 'SQLite + Prisma' },
                        { label: 'Frontend', value: systemInfo?.frontend || 'React + Vite' },
                        { label: 'Environment', value: systemInfo?.environment || 'Development' }
                      ].map(info => (
                        <div key={info.label} className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 uppercase mb-1">{info.label}</p>
                          <p className="font-medium text-gray-900">{info.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Database Stats */}
                    {systemInfo?.stats && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Database Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(systemInfo.stats).map(([key, value]) => (
                            <div key={key} className="p-3 bg-amber-50 rounded-lg text-center">
                              <p className="text-2xl font-bold text-amber-600">{value}</p>
                              <p className="text-xs text-gray-600 capitalize">{key}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`p-4 rounded-lg flex items-center gap-3 ${
                      systemInfo?.health?.status === 'healthy' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <CheckCircle className={`w-5 h-5 ${
                        systemInfo?.health?.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <p className={`font-medium ${
                          systemInfo?.health?.status === 'healthy' ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                          System Status: {systemInfo?.health?.status === 'healthy' ? 'Healthy' : 'Unknown'}
                        </p>
                        <p className={`text-sm ${
                          systemInfo?.health?.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {systemInfo?.health?.message || 'All services are running normally'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/health`.replace('/api/health', '/health')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Globe className="w-4 h-4" />
                      Check API Health
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

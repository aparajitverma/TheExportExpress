import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      icon: '👤',
      items: [
        { label: 'Name', value: user?.name || 'N/A' },
        { label: 'Email', value: user?.email || 'N/A' },
        { label: 'Role', value: user?.role || 'N/A' },
      ]
    },
    {
      title: 'Application Settings',
      description: 'Configure application-wide settings',
      icon: '⚙️',
      items: [
        { label: 'Theme', value: 'Dark Mode' },
        { label: 'Language', value: 'English' },
        { label: 'Timezone', value: 'UTC' },
      ]
    },
    {
      title: 'Security Settings',
      description: 'Manage security and privacy settings',
      icon: '🔒',
      items: [
        { label: 'Two-Factor Authentication', value: 'Disabled' },
        { label: 'Session Timeout', value: '24 hours' },
        { label: 'Login Notifications', value: 'Enabled' },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{section.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <p className="text-sm text-gray-400">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-blue-400 font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Configure {section.title}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
      >
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">📊</span>
          <div>
            <h3 className="text-lg font-semibold text-white">System Information</h3>
            <p className="text-sm text-gray-400">Application and environment details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Application Version</span>
              <span className="text-green-400">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Environment</span>
              <span className="text-yellow-400">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Database Status</span>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">API Status</span>
              <span className="text-green-400">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Last Backup</span>
              <span className="text-blue-400">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Uptime</span>
              <span className="text-purple-400">3 days, 12 hours</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Export Settings
        </button>
        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset to Defaults
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Settings; 
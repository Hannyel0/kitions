'use client';

import { Settings, Shield, Database, Mail, Bell, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Settings className="mx-auto h-16 w-16 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Advanced Settings Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This section will provide comprehensive platform configuration options including security, notifications, and system preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Manage authentication, authorization, and security policies.
          </p>
          <button disabled className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50">
            Configure Security
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Database</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Monitor database performance and manage data retention policies.
          </p>
          <button disabled className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50">
            Database Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Email</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configure email templates, SMTP settings, and delivery options.
          </p>
          <button disabled className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50">
            Email Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-8 w-8 text-yellow-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Manage notification preferences and delivery channels.
          </p>
          <button disabled className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50">
            Notification Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Platform</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            General platform settings, branding, and global configurations.
          </p>
          <button disabled className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50">
            Platform Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-gray-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">System</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            System maintenance, backups, and advanced configurations.
          </p>
          <button disabled className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50">
            System Settings
          </button>
        </div>
      </div>
    </div>
  );
} 
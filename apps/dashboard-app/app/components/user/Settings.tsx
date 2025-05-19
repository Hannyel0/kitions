import React, { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Globe2,
  Camera,
  Smartphone
} from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import useUserProfile from '@/app/hooks/useUserProfile'
import ProfileAvatar from '@/app/components/user/ProfileAvatar'

export function Settings() {
  const { user } = useAuth();
  const { firstName, lastName, profilePictureUrl, loading } = useUserProfile();
  
  // Form state
  const [displayName, setDisplayName] = useState(firstName ? `${firstName} ${lastName || ''}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Handle save changes
  const handleSaveChanges = () => {
    // Implementation for saving user profile changes would go here
    console.log('Saving changes:', { displayName, email });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-gray-800 font-semibold">Settings</h1>
        <button 
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-[#8982cf] text-white rounded-md text-sm font-medium hover:bg-[#7a73c0] transition-colors"
        >
          Save Changes
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                <ProfileAvatar
                  profilePictureUrl={profilePictureUrl}
                  firstName={firstName}
                  lastName={lastName}
                  size="lg"
                  className="w-full h-full"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-sm border border-gray-200">
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-lg text-gray-800 font-medium mb-1">
                {loading ? 'Loading...' : (firstName && lastName ? `${firstName} ${lastName}` : user?.email?.split('@')[0] || 'User')}
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                {user?.email || 'No email available'}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {[
            {
              icon: <Shield size={20} />,
              title: 'Security',
              description: 'Password, 2FA, recovery',
              badge: '2-Step Enabled',
            },
            {
              icon: <Bell size={20} />,
              title: 'Notifications',
              description: 'Email, push, SMS alerts',
            },
            {
              icon: <Smartphone size={20} />,
              title: 'Connected Devices',
              description: 'Manage your active sessions',
              badge: '3 Active',
            },
            {
              icon: <Globe2 size={20} />,
              title: 'Language & Region',
              description: 'Customize your experience',
              badge: 'English (US)',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600">{item.icon}</span>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-700">{item.description}</p>
              </div>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-700 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button className="px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50">
          Delete Account
        </button>
      </div>
    </div>
  )
}

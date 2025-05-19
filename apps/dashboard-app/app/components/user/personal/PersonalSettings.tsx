import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, CameraIcon } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import useUserProfile from '@/app/hooks/useUserProfile'
import ProfileAvatar from '@/app/components/user/ProfileAvatar'

export function PersonalSettings() {
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
      <div className="flex items-center mb-6">
        <Link
          href="/distributor/settings"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Settings
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900 text-2xl font-semibold">Personal Details</h1>
        <button 
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-[#8982cf] text-white rounded-md text-sm font-medium hover:bg-[#7a73c0] transition-colors"
        >
          Save Changes
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                <CameraIcon size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-gray-800 text-lg font-medium mb-1">
                {loading ? 'Loading...' : (firstName && lastName ? `${firstName} ${lastName}` : user?.email?.split('@')[0] || 'User')}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">
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

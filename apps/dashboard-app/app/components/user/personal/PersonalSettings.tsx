import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  BuildingIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  TrashIcon,
  EditIcon,
  SaveIcon,
  XIcon
} from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import useUserProfile from '@/app/hooks/useUserProfile'
import ProfileAvatar from '@/app/components/user/ProfileAvatar'

export function PersonalSettings() {
  const { user } = useAuth();
  const { firstName, lastName, profilePictureUrl, loading } = useUserProfile();
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567', // This would come from user data
    company: 'Kitions Distribution LLC', // This would come from user data
    address: '123 Business Ave, City, State 12345', // This would come from user data
  });
  
  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // Implementation for saving user profile changes would go here
    console.log('Saving changes:', formData);
    setIsEditing(false);
  };
  
  // Handle cancel editing
  const handleCancelEdit = () => {
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      company: 'Kitions Distribution LLC',
      address: '123 Business Ave, City, State 12345',
    });
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/distributor/settings"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Settings
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">Personal Settings</h1>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <EditIcon size={16} className="mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCancelEdit}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <XIcon size={16} className="mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <SaveIcon size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden shadow-lg">
                  <ProfileAvatar
                    profilePictureUrl={profilePictureUrl}
                    firstName={firstName}
                    lastName={lastName}
                    size="lg"
                    className="w-full h-full"
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border-2 border-white hover:bg-gray-50 transition-colors">
                  <CameraIcon size={16} className="text-gray-600" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? 'Loading...' : (firstName && lastName ? `${firstName} ${lastName}` : user?.email?.split('@')[0] || 'User')}
              </h2>
              
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <ShieldCheckIcon size={16} className="mr-2 text-green-500" />
                Verified Distributor
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center text-gray-600">
                  <MailIcon size={16} className="mr-2" />
                  {user?.email || 'No email available'}
                </div>
                <div className="flex items-center justify-center text-gray-600">
                  <CalendarIcon size={16} className="mr-2" />
                  Member since {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <UserIcon size={20} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your first name"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {formData.firstName || 'Not provided'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your last name"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {formData.lastName || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <MailIcon size={20} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {formData.email || 'Not provided'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {formData.phone || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <BuildingIcon size={20} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Business Information</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your company name"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {formData.company || 'Not provided'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Enter your business address"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {formData.address || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
            <TrashIcon size={20} className="text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-600">Danger Zone</h3>
        </div>
        
        <p className="text-gray-700 mb-6">
          Once you delete your account, there is no going back. Please be certain. 
          All your data, orders, and business information will be permanently removed.
        </p>
        
        <button className="flex items-center px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
          <TrashIcon size={16} className="mr-2" />
          Delete Account
        </button>
      </div>
    </div>
  )
}

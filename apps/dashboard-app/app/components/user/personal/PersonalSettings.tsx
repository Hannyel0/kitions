import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Cropper from 'react-easy-crop'
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

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Helper function to create image from canvas
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Helper function to get cropped image as blob
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CropArea,
  rotation = 0
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg', 0.9);
  });
};

export function PersonalSettings() {
  const { user } = useAuth();
  const { firstName, lastName, profilePictureUrl, loading } = useUserProfile();
  
  // Get user names with multiple fallbacks
  const userFirstName = firstName || user?.user_metadata?.first_name || user?.email?.split('@')[0]?.split('.')[0] || '';
  const userLastName = lastName || user?.user_metadata?.last_name || user?.email?.split('@')[0]?.split('.')[1] || '';
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+1 (555) 123-4567', // This would come from user data
    company: 'Kitions Distribution LLC', // This would come from user data
    address: '123 Business Ave, City, State 12345', // This would come from user data
  });
  
  // Update form data when profile loads
  React.useEffect(() => {
    setFormData({
      firstName: userFirstName,
      lastName: userLastName,
      email: user?.email || '',
      phone: '+1 (555) 123-4567', // This would come from user data
      company: 'Kitions Distribution LLC', // This would come from user data
      address: '123 Business Ave, City, State 12345', // This would come from user data
    });
  }, [userFirstName, userLastName, user?.email]);
  
  // Image upload state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      firstName: userFirstName,
      lastName: userLastName,
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      company: 'Kitions Distribution LLC',
      address: '123 Business Ave, City, State 12345',
    });
    setIsEditing(false);
  };
  
  // Handle profile picture click
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowImageModal(true);
      
      // Reset crop settings
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
    }
  };
  
  // Handle crop complete from react-easy-crop
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    
    try {
      setUploading(true);
      
      // Get cropped image using react-easy-crop helper
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels, rotation);
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', croppedBlob, 'profile-picture.jpg');
      formData.append('userId', user?.id || '');
      
      // Upload to your backend/storage service
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile picture uploaded successfully:', result);
        
        // Close modal and refresh profile
        setShowImageModal(false);
        setSelectedImage(null);
        setPreviewUrl('');
        
        // Show success toast
        setShowSuccessToast(true);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Hide success toast after 3 seconds
  React.useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        // Refresh the page to show the new profile picture
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
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
                <div 
                  className="cursor-pointer hover:opacity-90 transition-opacity group relative"
                  onClick={handleProfilePictureClick}
                >
                  <ProfileAvatar
                    profilePictureUrl={profilePictureUrl}
                    firstName={userFirstName}
                    lastName={userLastName}
                    size="xl"
                  />
                  <div className="absolute inset- bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-full pointer-events-none">
                    <CameraIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <button 
                  onClick={handleProfilePictureClick}
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border-2 border-white hover:bg-gray-50 transition-colors"
                >
                  <CameraIcon size={16} className="text-gray-600" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? 'Loading...' : (userFirstName && userLastName ? `${userFirstName} ${userLastName}` : user?.email?.split('@')[0] || 'User')}
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

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Crop your new profile picture</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XIcon size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Cropper Container */}
              <div className="relative h-96 bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-200">
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f9fafb',
                    },
                    cropAreaStyle: {
                      border: '2px dashed rgba(107, 114, 128, 0.5)',
                    },
                  }}
                />
              </div>
              
              {/* Hint Text */}
              <p className="text-gray-500 text-sm text-center mb-6">
                Drag to reposition • Scroll to zoom • Double-tap to reset
              </p>
              
              {/* Action Button */}
              <button
                onClick={handleImageUpload}
                disabled={uploading || !croppedAreaPixels}
                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Uploading...
                  </>
                ) : (
                  'Set new profile picture'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 ease-in-out">
          <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
          </div>
          <span className="font-medium">Profile picture updated successfully!</span>
        </div>
      )}
    </div>
  )
}

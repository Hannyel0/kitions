'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';
import Image from 'next/image';

export default function ProfileForm() {
  const { user } = useAuth();
  const supabase = createSupabaseBrowserClient();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    async function loadUserProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, phone, profile_picture_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setPhone(data.phone || '');
          setProfilePicture(data.profile_picture_url || null);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error loading user profile:', errorMessage);
        setMessage({ text: 'Failed to load profile data', type: 'error' });
      }
    }
    
    loadUserProfile();
  }, [user, supabase]);

  // Handle profile image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadedImage(files[0]);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    setDebugInfo(null);
    
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      let profilePictureUrl = profilePicture;
      const uploadDebugInfo: Record<string, unknown> = {};
      
      // Upload new profile picture if selected
      if (uploadedImage) {
        try {
          const fileExt = uploadedImage.name.split('.').pop();
          // Use proper folder structure with user ID
          const filePath = `${user.id}/${user.id}-${Date.now()}.${fileExt}`;
          
          console.log("Attempting to upload file to path:", filePath);
          uploadDebugInfo.filePath = filePath;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(filePath, uploadedImage, {
              contentType: uploadedImage.type,
              upsert: true // Overwrite if exists
            });
            
          console.log("Upload response:", uploadData, uploadError);
          uploadDebugInfo.uploadResponse = { data: uploadData, error: uploadError };
          
          if (uploadError) {
            uploadDebugInfo.uploadError = uploadError;
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
          
          // Get the public URL for the uploaded image
          const { data } = await supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);
          
          console.log("Public URL response:", data);
          uploadDebugInfo.publicUrlResponse = data;
            
          profilePictureUrl = data.publicUrl;
        } catch (uploadErr) {
          const errorMessage = uploadErr instanceof Error ? uploadErr.message : 'Unknown error';
          console.error("Image upload error:", errorMessage);
          uploadDebugInfo.uploadException = errorMessage;
          setDebugInfo(JSON.stringify(uploadDebugInfo, null, 2));
          throw new Error(`Image upload failed: ${errorMessage}`);
        }
      }
      
      // Update user metadata
      console.log("Updating auth user metadata with:", { first_name: firstName, last_name: lastName });
      const { data: authData, error: authUpdateError } = await supabase.auth.updateUser({
        data: { 
          first_name: firstName,
          last_name: lastName
        }
      });
      
      console.log("Auth update response:", authData, authUpdateError);
      
      if (authUpdateError) {
        throw new Error(`Auth update failed: ${authUpdateError.message}`);
      }
      
      // Update user profile in the database
      console.log("Updating user profile with:", { 
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        profile_picture_url: profilePictureUrl
      });
      
      const { data: profileData, error: profileUpdateError } = await supabase
        .from('users')
        .update({ 
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          profile_picture_url: profilePictureUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      console.log("Profile update response:", profileData, profileUpdateError);
        
      if (profileUpdateError) {
        throw new Error(`Profile update failed: ${profileUpdateError.message}`);
      }
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating profile:', errorMessage);
      setMessage({ text: `Failed to update profile: ${errorMessage}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100">
          {profilePicture ? (
            <Image 
              src={profilePicture} 
              alt="Profile picture" 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl text-gray-400">
              {firstName && lastName ? (
                `${firstName[0]}${lastName[0]}`
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              )}
            </div>
          )}
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#8982cf] file:text-white
              hover:file:bg-[#7a73c0]
              cursor-pointer"
          />
        </label>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf]"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf]"
            required
          />
        </div>
      </div>
      
      {/* Message display */}
      {message.text && (
        <div className={`p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      {/* Debug info (only shown when there's an issue) */}
      {debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-700">Debug Information</summary>
            <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-800 text-white rounded-md">
              {debugInfo}
            </pre>
          </details>
        </div>
      )}
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#8982cf] text-white rounded-md hover:bg-[#7a73c0] focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : 'Update Profile'}
        </button>
      </div>
    </form>
  );
} 
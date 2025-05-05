'use client';

import Image from 'next/image';
import React from 'react';

type ProfileAvatarProps = {
  profilePictureUrl: string | null;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function ProfileAvatar({ 
  profilePictureUrl, 
  firstName, 
  lastName, 
  size = 'md',
  className = ''
}: ProfileAvatarProps) {
  // Get user's initials for the fallback display
  const userInitials = React.useMemo(() => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || '?';
  }, [firstName, lastName]);

  // Calculate size classes based on the size prop
  const sizeClasses = React.useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-8 w-8',
          text: 'text-sm'
        };
      case 'lg':
        return {
          container: 'h-12 w-12',
          text: 'text-lg'
        };
      case 'md':
      default:
        return {
          container: 'h-10 w-10',
          text: 'text-base'
        };
    }
  }, [size]);

  return (
    <div className={`relative rounded-full overflow-hidden flex-shrink-0 ${sizeClasses.container} ${className}`}>
      {profilePictureUrl ? (
        <Image
          src={profilePictureUrl}
          alt={`${firstName} ${lastName}`}
          fill
          className="object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium ${sizeClasses.text}`}>
          {userInitials}
        </div>
      )}
    </div>
  );
} 
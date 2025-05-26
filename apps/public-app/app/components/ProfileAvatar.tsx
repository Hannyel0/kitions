import React from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  profilePictureUrl?: string | null;
}

const sizeMap = {
  sm: { container: 'h-8 w-8', text: 'text-xs' },
  md: { container: 'h-10 w-10', text: 'text-sm' },
  lg: { container: 'h-12 w-12', text: 'text-base' },
};

export default function ProfileAvatar({
  firstName = '',
  lastName = '',
  email = '',
  size = 'md',
  className = '',
  profilePictureUrl,
}: ProfileAvatarProps) {
  // Get initials from name or email
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Generate a consistent color based on the user's name/email
  const getColor = () => {
    const name = firstName || email || 'user';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-indigo-100 text-indigo-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-rose-100 text-rose-800',
      'bg-amber-100 text-amber-800',
      'bg-emerald-100 text-emerald-800',
      'bg-cyan-100 text-cyan-800',
      'bg-blue-100 text-blue-800',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (profilePictureUrl) {
    return (
      <div className={`${sizeMap[size].container} relative rounded-full overflow-hidden ${className}`}>
        <Image
          src={profilePictureUrl}
          alt={`${firstName} ${lastName}`.trim() || 'Profile'}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeMap[size].container} ${getColor()} rounded-full flex items-center justify-center font-medium ${sizeMap[size].text} ${className}`}
    >
      {getInitials()}
    </div>
  );
}

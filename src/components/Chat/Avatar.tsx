import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ src, name, isOnline, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-24 w-24 text-3xl',
  };

  const getInitials = (userName: string) => {
    if (!userName) return '?';
    const names = userName.trim().split(' ').filter(Boolean);
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (userName: string) => {
    if (!userName || userName === '?' || userName === 'Unknown' || userName === 'You') return 'bg-gray-200 text-gray-700 border-gray-300';
    const colors = [
      'bg-red-100 text-red-700 border-red-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-violet-100 text-violet-700 border-violet-200',
      'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      'bg-rose-100 text-rose-700 border-rose-200',
    ];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const isDefaultImage = !src || src.includes('placeholder') || src.includes('Apen.png');
  const colorClass = getAvatarColor(name || '');

  return (
    <div className={`relative flex-shrink-0 ${sizes[size]} rounded-full flex items-center justify-center font-bold border ${colorClass}`}>
      {!isDefaultImage ? (
        <>
          <img
            src={src}
            alt={name || "avatar"}
            className="rounded-full object-cover h-full w-full absolute inset-0 z-10"
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="z-0">{getInitials(name || '')}</span>
        </>
      ) : (
        <span>{getInitials(name || '')}</span>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success z-20" />
      )}
    </div>
  );
};

export default Avatar;

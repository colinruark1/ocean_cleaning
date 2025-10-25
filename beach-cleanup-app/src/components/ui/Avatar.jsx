import { User } from 'lucide-react';

/**
 * Avatar component for user images
 * @param {Object} props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.alt] - Alt text
 * @param {string} [props.name] - User name (for initials fallback)
 * @param {string} [props.size='md'] - Avatar size
 * @param {string} [props.className] - Additional CSS classes
 */
const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base',
    xl: 'h-24 w-24 text-xl',
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`rounded-full object-cover ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-ocean-100 flex items-center justify-center ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {name ? (
        <span className="font-semibold text-ocean-600">{getInitials(name)}</span>
      ) : (
        <User className="text-ocean-600" size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} />
      )}
    </div>
  );
};

export default Avatar;

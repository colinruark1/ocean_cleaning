import { useState } from 'react';
import { Trash2, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from './Avatar';
import { updateUpvotes } from '../../services/googleSheets';

/**
 * CleanupPost Component
 * Polaroid-style post for beach cleaning adventures
 * Features sandy-colored film border, image, caption, and trash can upvote
 * Upvotes are synced with Google Sheets database
 */
const CleanupPost = ({ post }) => {
  const { isDarkMode } = useTheme();
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isUpdatingUpvote, setIsUpdatingUpvote] = useState(false);

  const handleUpvote = async () => {
    // Prevent double clicks
    if (isUpdatingUpvote) return;

    setIsUpdatingUpvote(true);

    try {
      const newUpvoteCount = isUpvoted ? upvotes - 1 : upvotes + 1;

      // Optimistically update UI
      setUpvotes(newUpvoteCount);
      setIsUpvoted(!isUpvoted);

      // Update in Google Sheets database
      console.log(`🗳️ Updating upvotes for post ${post.id} to ${newUpvoteCount}`);
      await updateUpvotes(post.id, newUpvoteCount);
      console.log('✅ Upvote synced to database');
    } catch (error) {
      console.error('❌ Failed to sync upvote to database:', error);
      // Revert on error
      setUpvotes(isUpvoted ? upvotes + 1 : upvotes - 1);
      setIsUpvoted(isUpvoted);
    } finally {
      setIsUpdatingUpvote(false);
    }
  };

  const handleImageError = (e) => {
    console.error(`❌ Failed to load image for post ${post.id}:`, post.imageUrl);
    console.error('Image error event:', e);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <div className="polaroid-container">
      {/* Polaroid wrapper with sandy film color */}
      <div
        className="rounded-lg shadow-xl p-3 hover:shadow-2xl transition-all duration-300"
        style={{
          background: isDarkMode
            ? 'linear-gradient(to bottom, #242E3F, #1A2332)'
            : 'linear-gradient(to bottom, #fef3c7, #fde68a)',
          borderColor: isDarkMode ? '#374151' : '#f3c66b'
        }}
      >
        {/* User info header */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <Avatar name={post.displayName || post.username} size="sm" />
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{color: 'var(--color-text-primary)'}}>{post.displayName || post.username}</p>
            {post.location && (
              <p className="text-xs flex items-center gap-1" style={{color: 'var(--color-text-secondary)'}}>
                <MapPin className="h-3 w-3" />
                {post.location}
              </p>
            )}
          </div>
          {post.date && (
            <span className="text-xs flex items-center gap-1" style={{color: 'var(--color-text-secondary)'}}>
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
          )}
        </div>

        {/* Image container with polaroid aspect ratio */}
        <div className="p-2 mb-3" style={{backgroundColor: isDarkMode ? '#1A2332' : '#ffffff'}}>
          <div className="relative aspect-square overflow-hidden" style={{backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'}}>
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center" style={{backgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb'}}>
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}

            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{background: isDarkMode ? 'linear-gradient(to bottom right, #374151, #4b5563)' : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)', color: isDarkMode ? '#9ca3af' : '#9ca3af'}}>
                <ImageIcon className="h-16 w-16 mb-2" />
                <p className="text-xs text-center px-4">Image unavailable</p>
              </div>
            ) : (
              <img
                src={post.imageUrl}
                alt={post.caption || 'Beach cleanup'}
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
            )}
          </div>
        </div>

        {/* Caption area - polaroid style bottom space */}
        <div className="px-3 py-4 min-h-[80px]" style={{backgroundColor: isDarkMode ? '#1A2332' : '#ffffff'}}>
          <p className="text-sm leading-relaxed text-center font-handwriting" style={{color: 'var(--color-text-primary)'}}>
            {post.caption}
          </p>
          {post.trashCollected && (
            <p className="text-xs text-center mt-2" style={{color: 'var(--color-text-secondary)'}}>
              {post.trashCollected} collected
            </p>
          )}
        </div>

        {/* Upvote section */}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          <button
            onClick={handleUpvote}
            disabled={isUpdatingUpvote}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isUpdatingUpvote ? 'opacity-50 cursor-wait' : 'cursor-pointer'
            }`}
            style={{
              backgroundColor: isUpvoted ? '#3b82f6' : (isDarkMode ? '#1A2332' : '#ffffff'),
              color: isUpvoted ? '#ffffff' : 'var(--color-text-primary)',
              border: isUpvoted ? 'none' : `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              boxShadow: isUpvoted ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            aria-label={isUpvoted ? 'Remove upvote' : 'Upvote post'}
          >
            <Trash2
              className={`h-5 w-5 transition-transform ${isUpvoted ? 'scale-110' : ''} ${isUpdatingUpvote ? 'animate-pulse' : ''}`}
              fill={isUpvoted ? 'currentColor' : 'none'}
            />
            <span className="font-semibold text-sm">{upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleanupPost;

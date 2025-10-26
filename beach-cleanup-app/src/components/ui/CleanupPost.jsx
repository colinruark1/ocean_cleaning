import { useState } from 'react';
import { Trash2, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import Avatar from './Avatar';

/**
 * CleanupPost Component
 * Polaroid-style post for beach cleaning adventures
 * Features sandy-colored film border, image, caption, and trash can upvote
 */
const CleanupPost = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvotes(upvotes - 1);
      setIsUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);
    }
  };

  const handleImageError = () => {
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
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-xl p-3 hover:shadow-2xl transition-shadow duration-300">
        {/* User info header */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <Avatar name={post.username} size="sm" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{post.username}</p>
            {post.location && (
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {post.location}
              </p>
            )}
          </div>
          {post.date && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
          )}
        </div>

        {/* Image container with polaroid aspect ratio */}
        <div className="bg-white p-2 mb-3">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}

            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
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
        <div className="bg-white px-3 py-4 min-h-[80px]">
          <p className="text-gray-800 text-sm leading-relaxed text-center font-handwriting">
            {post.caption}
          </p>
          {post.trashCollected && (
            <p className="text-xs text-gray-600 text-center mt-2">
              {post.trashCollected} collected
            </p>
          )}
        </div>

        {/* Upvote section */}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isUpvoted
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            aria-label={isUpvoted ? 'Remove upvote' : 'Upvote post'}
          >
            <Trash2
              className={`h-5 w-5 transition-transform ${isUpvoted ? 'scale-110' : ''}`}
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

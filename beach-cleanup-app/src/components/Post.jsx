import { useState } from 'react';
import { Heart, MessageCircle, MapPin, MoreVertical, Send } from 'lucide-react';
import { Button, Input } from './ui';

/**
 * Post Component
 * Displays a social media post with media (images/videos), likes, and comments
 */
const Post = ({ post, onLike, onComment, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    await onComment(post.id, commentText);
    setCommentText('');
    setIsSubmitting(false);
  };

  const handleMediaNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentMediaIndex((prev) =>
        prev < post.media.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentMediaIndex((prev) =>
        prev > 0 ? prev - 1 : post.media.length - 1
      );
    }
  };

  const currentMedia = post.media[currentMediaIndex];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white font-semibold">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              post.author.name.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Media Display */}
      {post.media && post.media.length > 0 && (
        <div className="relative bg-gray-900 aspect-square">
          {currentMedia.type === 'image' ? (
            <img
              src={currentMedia.url}
              alt={currentMedia.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={currentMedia.url}
              poster={currentMedia.thumbnail}
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {/* Media Navigation Dots */}
          {post.media.length > 1 && (
            <>
              {/* Navigation Arrows */}
              {currentMediaIndex > 0 && (
                <button
                  onClick={() => handleMediaNavigation('prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  aria-label="Previous media"
                >
                  ‹
                </button>
              )}
              {currentMediaIndex < post.media.length - 1 && (
                <button
                  onClick={() => handleMediaNavigation('next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  aria-label="Next media"
                >
                  ›
                </button>
              )}

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.media.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMediaIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50'
                    }`}
                    aria-label={`View media ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 group transition-transform hover:scale-110"
            aria-label={post.likedByUser ? 'Unlike post' : 'Like post'}
          >
            <Heart
              className={`h-6 w-6 transition-colors ${
                post.likedByUser
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-700 group-hover:text-red-500'
              }`}
            />
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 group transition-transform hover:scale-110"
            aria-label="Comment on post"
          >
            <MessageCircle className="h-6 w-6 text-gray-700 group-hover:text-ocean-500 transition-colors" />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm text-gray-900 mb-2">
          {post.likes.toLocaleString()} {post.likes === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-gray-900 mr-2">{post.author.name}</span>
          <span className="text-gray-800">{post.caption}</span>
        </div>

        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <MapPin className="h-3 w-3" />
            <span>{post.location}</span>
          </div>
        )}

        {/* Comments Section */}
        {post.comments && post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            View {showComments ? 'less' : `all ${post.comments.length}`} {post.comments.length === 1 ? 'comment' : 'comments'}
          </button>
        )}

        {/* Comments List */}
        {showComments && (
          <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    comment.author.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">{comment.author.name}</p>
                    <p className="text-sm text-gray-800">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-3">{comment.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        {showComments && (
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-3 pt-3 border-t">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!commentText.trim() || isSubmitting}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Post
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Post;

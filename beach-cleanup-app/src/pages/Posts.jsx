import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { useApp } from '../contexts/AppContext';
import Post from '../components/Post';
import CreatePostModal from '../components/CreatePostModal';
import { Button, LoadingSpinner, EmptyState } from '../components/ui';
import PageHeader from '../components/layout/PageHeader';

/**
 * Posts Page
 * Social media feed for beach cleanup posts
 * Users can create posts, like, and comment
 */
const Posts = () => {
  const { posts, isLoading, error, createPost, likePost, addComment, deletePost } = usePosts();
  const { showSuccess, showError } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePost = async (postData) => {
    const result = await createPost(postData);

    if (result.success) {
      showSuccess('Post created successfully!');
      return result;
    } else {
      showError(result.error || 'Failed to create post');
      return result;
    }
  };

  const handleLikePost = async (postId) => {
    await likePost(postId);
  };

  const handleAddComment = async (postId, text) => {
    const result = await addComment(postId, text);

    if (!result.success) {
      showError(result.error || 'Failed to add comment');
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await deletePost(postId);

    if (result.success) {
      showSuccess('Post deleted successfully');
    } else {
      showError(result.error || 'Failed to delete post');
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading posts: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Community Feed"
          description="Share your beach cleanup stories and connect with fellow ocean protectors"
          action={
            <Button
              leftIcon={<Plus className="h-5 w-5" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Post
            </Button>
          }
        />

        {isLoading ? (
          <LoadingSpinner message="Loading posts..." />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Plus className="h-12 w-12" />}
            title="No posts yet"
            description="Be the first to share your beach cleanup story!"
            action={
              <Button onClick={() => setShowCreateModal(true)}>
                Create First Post
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onComment={handleAddComment}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </div>
  );
};

export default Posts;

import { useState, useEffect } from 'react';
import { mockPosts } from '../services/mockData';

/**
 * Custom hook for managing posts
 * Handles fetching, creating, liking, and commenting on posts
 */
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPosts(mockPosts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  /**
   * Create a new post
   * @param {Object} postData - Post data including caption, media, location
   * @returns {Object} Result object with success status
   */
  const createPost = async (postData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPost = {
        id: Date.now(),
        author: {
          id: '1',
          name: 'Alex Rivera', // Current user
          avatar: null,
        },
        caption: postData.caption,
        media: postData.media || [],
        location: postData.location || '',
        likes: 0,
        likedByUser: false,
        comments: [],
        timestamp: 'Just now',
        createdAt: new Date().toISOString(),
      };

      setPosts((prev) => [newPost, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Toggle like on a post
   * @param {number} postId - ID of the post to like/unlike
   */
  const likePost = async (postId) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser,
            };
          }
          return post;
        })
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));

      return { success: true };
    } catch (err) {
      // Revert on error
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.likedByUser ? post.likes + 1 : post.likes - 1,
              likedByUser: !post.likedByUser,
            };
          }
          return post;
        })
      );
      return { success: false, error: err.message };
    }
  };

  /**
   * Add a comment to a post
   * @param {number} postId - ID of the post
   * @param {string} text - Comment text
   */
  const addComment = async (postId, text) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newComment = {
        id: Date.now(),
        author: {
          id: '1',
          name: 'Alex Rivera', // Current user
          avatar: null,
        },
        text,
        timestamp: 'Just now',
      };

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            };
          }
          return post;
        })
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Delete a post
   * @param {number} postId - ID of the post to delete
   */
  const deletePost = async (postId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    posts,
    isLoading,
    error,
    createPost,
    likePost,
    addComment,
    deletePost,
  };
};

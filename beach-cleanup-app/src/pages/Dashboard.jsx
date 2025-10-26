import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPosts, addPost } from '../services/googleSheets';
import { Button, CleanupPost, UploadPostModal } from '../components/ui';
import { testGoogleSheetsConnection } from '../utils/testGoogleSheets';

// Import ocean sprite images
import orcaImage from '../assets/orca.png';
import turtleImage from '../assets/turtle.png';
import whaleImage from '../assets/whale.png';

/**
 * Dashboard Page
 * Instagram-style feed showing beach cleaning adventures
 * Light mode design with polaroid-style posts
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Light mode colors for now
  const colors = {
    heroBg: 'linear-gradient(135deg, #1C6EA4 0%, #154D71 100%)',
    heroText: '#FFF9AF',
    bgPrimary: '#F5F5F5',
    buttonBg: '#33A1E0',
    buttonText: '#154D71',
  };

  // Fetch posts on component mount
  useEffect(() => {
    // Run connection test in development
    if (import.meta.env.DEV) {
      testGoogleSheetsConnection();
    }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading posts from Google Sheets database...');

      // Fetch from Google Sheets only - no fallbacks
      const sheetPosts = await fetchPosts();

      console.log('📊 Loaded posts from database:', sheetPosts?.length || 0);

      // Set posts from Google Sheets (or empty array if none)
      setPosts(sheetPosts || []);
    } catch (error) {
      console.error('❌ Error loading posts from database:', error);
      // Set empty array on error - posts must come from database only
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPost = async (postData) => {
    try {
      const newPost = await addPost(postData);
      // Reload posts to show the new one
      await loadPosts();
      return newPost;
    } catch (error) {
      console.error('Error uploading post:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: colors.bgPrimary}}>
      {/* Hero Section with Ocean Gradient */}
      <div style={{background: colors.heroBg}} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          {/* Decorative ocean elements - animated sprites */}
          <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
            {/* Whale swimming across top */}
            <img
              src={whaleImage}
              alt="Whale"
              className="absolute top-10 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain animate-swim-right"
              style={{ left: '-10%' }}
            />

            {/* Orca swimming across middle */}
            <img
              src={orcaImage}
              alt="Orca"
              className="absolute top-1/2 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain animate-swim-left"
              style={{ right: '-10%', transform: 'translateY(-50%) scaleX(-1)' }}
            />

            {/* Turtle floating in bottom right */}
            <img
              src={turtleImage}
              alt="Turtle"
              className="absolute bottom-10 right-8 sm:right-16 md:right-24 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain animate-float-slow"
            />

            {/* Animated bubbles - SVG */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Bubble group 1 - left side */}
              <circle cx="15%" cy="80%" r="4" fill="rgba(255, 255, 255, 0.6)" className="animate-bubble-1" />
              <circle cx="18%" cy="75%" r="6" fill="rgba(255, 255, 255, 0.5)" className="animate-bubble-2" />
              <circle cx="12%" cy="85%" r="3" fill="rgba(255, 255, 255, 0.7)" className="animate-bubble-3" />

              {/* Bubble group 2 - center */}
              <circle cx="45%" cy="90%" r="5" fill="rgba(255, 255, 255, 0.6)" className="animate-bubble-2" />
              <circle cx="50%" cy="85%" r="4" fill="rgba(255, 255, 255, 0.5)" className="animate-bubble-1" />
              <circle cx="48%" cy="95%" r="3" fill="rgba(255, 255, 255, 0.7)" className="animate-bubble-3" />

              {/* Bubble group 3 - right side */}
              <circle cx="85%" cy="75%" r="6" fill="rgba(255, 255, 255, 0.5)" className="animate-bubble-1" />
              <circle cx="88%" cy="80%" r="4" fill="rgba(255, 255, 255, 0.6)" className="animate-bubble-3" />
              <circle cx="82%" cy="85%" r="5" fill="rgba(255, 255, 255, 0.6)" className="animate-bubble-2" />
            </svg>
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight" style={{color: '#ffffff'}}>
              {user ? `Welcome back, ${user.name || user.username}!` : 'Welcome to OceanClean'}
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed" style={{color: colors.heroText}}>
              {user
                ? "Check out the latest beach cleaning adventures from our community!"
                : "Join ocean lovers around the world making a difference, one cleanup at a time."}
            </p>
            {!user && (
              <div className="mt-8 flex gap-4 justify-center flex-wrap">
                <Link to="/register">
                  <Button size="lg" className="font-semibold px-8" style={{backgroundColor: colors.buttonBg, color: colors.buttonText}}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="secondary" className="font-semibold px-8 border-2" style={{borderColor: colors.heroText, color: colors.heroText, backgroundColor: 'transparent'}}>
                    Browse Events
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 sm:h-16">
            <path fill={colors.bgPrimary} fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content - Instagram-style Post Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Community Cleanup Adventures</h2>
              <p className="text-gray-600">Share your beach cleaning journey and inspire others!</p>
            </div>
            {user && (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="ml-4 flex items-center gap-2"
                style={{backgroundColor: colors.buttonBg, color: 'white'}}
              >
                <Upload className="h-5 w-5" />
                <span className="hidden sm:inline">Share Post</span>
              </Button>
            )}
          </div>
        </div>

        {/* Polaroid Post Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No posts yet. Be the first to share your cleanup adventure!</p>
            {user && (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                style={{backgroundColor: colors.buttonBg, color: 'white'}}
              >
                <Upload className="h-5 w-5 inline mr-2" />
                Share Your First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {posts.map((post) => (
              <CleanupPost key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 rounded-2xl shadow-lg p-8 text-white text-center" style={{background: colors.heroBg}}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Share Your Cleanup Adventure!</h3>
          <p className="text-lg mb-6" style={{color: colors.heroText}}>
            Join a cleanup event and share your impact with the community.
          </p>
          <Link to="/events">
            <Button
              variant="secondary"
              size="lg"
              className="font-semibold hover:opacity-90 transition-opacity"
              style={{backgroundColor: '#ffffff', color: colors.buttonText}}
            >
              Browse Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Upload Post Modal */}
      <UploadPostModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadPost}
        currentUser={user}
      />
    </div>
  );
};

export default Dashboard;

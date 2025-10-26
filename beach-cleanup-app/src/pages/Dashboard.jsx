import { MapPin, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { useAuth } from '../contexts/AuthContext';
import { mockStats } from '../services/mockData';
import { Card, CardHeader, Avatar, LoadingSpinner, EmptyState, Button, StatCard } from '../components/ui';

// Import ocean sprite images
import orcaImage from '../assets/orca.png';
import turtleImage from '../assets/turtle.png';
import whaleImage from '../assets/whale.png';

/**
 * Dashboard Page
 * Shows community activity feed and user stats overview
 * Refactored with industry-standard patterns
 */
const Dashboard = () => {
  const { activities, isLoading, error } = useActivities();
  const { user } = useAuth();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Ocean Gradient */}
      <div style={{background: 'linear-gradient(135deg, #27548A 0%, #183B4E 100%)'}} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
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
              className="absolute bottom-16 right-8 sm:right-16 md:right-24 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain animate-float-slow"
            />
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {user ? `Welcome back, ${user.name || user.username}!` : 'Welcome to OceanClean'}
            </h1>
            <p className="text-xl sm:text-2xl text-cream max-w-3xl mx-auto leading-relaxed" style={{color: '#F3F3E0'}}>
              {user
                ? "Here's your impact summary and recent community activity. Together, we're making waves for cleaner oceans."
                : "Join ocean lovers around the world making a difference, one cleanup at a time."}
            </p>
            {!user && (
              <div className="mt-8 flex gap-4 justify-center flex-wrap">
                <Link to="/register">
                  <Button size="lg" className="font-semibold px-8" style={{backgroundColor: '#DDA853', color: '#183B4E'}}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="secondary" className="font-semibold px-8 border-2" style={{borderColor: '#F3F3E0', color: '#F3F3E0', backgroundColor: 'transparent'}}>
                    Browse Events
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 sm:h-20">
            <path fill="#F3F3E0" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Overview */}
        {user && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{color: '#183B4E'}}>Your Impact</h2>
              <Link to="/profile" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{color: '#27548A'}}>
                View Full Profile →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Cleanups"
                value={stats.totalCleanups}
                icon={<Trash2 className="h-8 w-8" />}
                color="ocean"
              />
              <StatCard
                title="Trash Collected"
                value={stats.totalTrash}
                icon={<Award className="h-8 w-8" />}
                color="green"
              />
              <StatCard
                title="Events Organized"
                value={stats.eventsOrganized}
                icon={<Calendar className="h-8 w-8" />}
                color="purple"
              />
              <StatCard
                title="Global Rank"
                value={stats.rank}
                icon={<TrendingUp className="h-8 w-8" />}
                color="orange"
              />
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold" style={{color: '#183B4E'}}>Recent Activity</h2>
          </CardHeader>

          {isLoading ? (
            <LoadingSpinner message="Loading activities..." />
          ) : activities.length === 0 ? (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="No recent activity"
              description="Start by joining an event or creating a group to see activity here."
            />
          ) : (
            <div className="divide-y" style={{borderColor: '#E5E7EB'}}>
              {activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start space-x-4">
                    <Avatar name={activity.user} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{color: '#183B4E'}}>
                        {activity.user}{' '}
                        <span className="font-normal" style={{color: '#6B7280'}}>{activity.action}</span>
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm flex-wrap" style={{color: '#6B7280'}}>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {activity.location}
                        </span>
                        <span className="flex items-center">
                          <Trash2 className="h-4 w-4 mr-1" />
                          {activity.trash}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {activity.participants} participants
                        </span>
                      </div>
                      <p className="mt-1 text-xs" style={{color: '#9CA3AF'}}>{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Call to Action */}
        <div className="mt-8 rounded-2xl shadow-lg p-8 text-white" style={{background: 'linear-gradient(135deg, #27548A 0%, #183B4E 100%)'}}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Join a Cleanup Event Today!</h3>
          <p className="text-lg mb-6" style={{color: '#F3F3E0'}}>
            Connect with local ocean lovers and make a difference in your community.
          </p>
          <Link to="/events">
            <Button
              variant="secondary"
              size="lg"
              className="font-semibold hover:opacity-90 transition-opacity"
              style={{backgroundColor: '#DDA853', color: '#183B4E'}}
            >
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

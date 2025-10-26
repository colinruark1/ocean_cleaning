import { MapPin, Trash2, Users, Award, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, Avatar, LoadingSpinner, EmptyState, Button } from '../components/ui';

/**
 * Dashboard Page
 * Shows community activity feed and user stats overview
 * Refactored with industry-standard patterns
 */
const Dashboard = () => {
  const { activities, isLoading, error } = useActivities();
  const { user } = useAuth();

  // TODO: Fetch real stats from backend
  const stats = mockStats;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      {user && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || user.username}!
          </h1>
          <p className="text-gray-600">Here's the recent community activity.</p>
        </div>
      )}

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
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
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-start space-x-4">
                  <Avatar name={activity.user} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}{' '}
                      <span className="font-normal text-gray-600">{activity.action}</span>
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 flex-wrap">
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
                    <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Call to Action */}
      <div className="mt-8 bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-lg shadow-lg p-8 text-white" style={{ backgroundColor: '#0284c7' }}>
        <h3 className="text-2xl font-bold mb-4 text-white" style={{ color: '#ffffff' }}>Join a Cleanup Event Today!</h3>
        <p className="mb-6 text-white" style={{ color: '#ffffff' }}>
          Connect with local ocean lovers and make a difference in your community.
        </p>
        <Link to="/events">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-ocean-600 hover:bg-gray-100"
            style={{ backgroundColor: '#ffffff', color: '#0284c7' }}
          >
            Browse Events
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

import { MapPin, Trash2, Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { mockStats } from '../services/mockData';
import { Card, CardHeader, Avatar, StatCard, LoadingSpinner, EmptyState, Button } from '../components/ui';

/**
 * Dashboard Page
 * Shows user stats and activity feed
 * Refactored with industry-standard patterns
 */
const Dashboard = () => {
  const { activities, isLoading, error } = useActivities();

  // TODO: Replace with real user stats from API/context
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Cleanups"
          value={stats.totalCleanups}
          icon={<Trash2 className="h-12 w-12" />}
          color="ocean"
        />
        <StatCard
          title="Trash Collected"
          value={stats.totalTrash}
          icon={<Award className="h-12 w-12" />}
          color="green"
        />
        <StatCard
          title="Distance Covered"
          value={stats.totalDistance}
          icon={<MapPin className="h-12 w-12" />}
          color="blue"
        />
        <StatCard
          title="Global Rank"
          value={stats.rank}
          icon={<TrendingUp className="h-12 w-12" />}
          color="orange"
        />
      </div>

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
      <div className="mt-8 bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Join a Cleanup Event Today!</h3>
        <p className="mb-6">
          Connect with local ocean lovers and make a difference in your community.
        </p>
        <Link to="/events">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-ocean-600 hover:bg-gray-100"
          >
            Browse Events
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from 'react';
import { MapPin, Calendar, Trash2, Users, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockStats, mockAchievements } from '../services/mockData';
import { formatDate, calculatePercentage } from '../utils/helpers';
import { Card, CardHeader, Avatar, StatCard, Badge, Button } from '../components/ui';
import ProfileEditModal from '../components/ProfileEditModal';

/**
 * Profile Page
 * User profile with stats, activity history, and achievements
 * Refactored with industry-standard patterns
 */
const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // TODO: Fetch real stats and achievements from backend
  const stats = mockStats;
  const achievements = mockAchievements;

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'cleanup',
      title: 'Venice Beach Morning Cleanup',
      date: '2025-10-24',
      trash: '28 lbs',
      distance: '2.1 km',
      participants: 12,
    },
    {
      id: 2,
      type: 'event',
      title: 'Created "Weekend Warriors" Event',
      date: '2025-10-20',
      participants: 24,
    },
    {
      id: 3,
      type: 'cleanup',
      title: 'Santa Monica Pier Cleanup',
      date: '2025-10-17',
      trash: '35 lbs',
      distance: '1.8 km',
      participants: 8,
    },
  ];

  // Calculate progress to next milestone
  const nextMilestone = 50;
  const progress = calculatePercentage(stats.totalCleanups, nextMilestone);

  const handleSaveProfile = async (updates) => {
    const result = await updateProfile(updates);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  // Show loading or login prompt if no user
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-ocean-400 to-ocean-600" />
        <div className="px-6 pb-6">
          <div className="flex items-start -mt-16 mb-4">
            <Avatar name={user.name} size="xl" className="border-4 border-white" />
          </div>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center text-gray-600 mt-2 space-x-4 flex-wrap">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {user.joined}
                </span>
              </div>
              {user.bio && <p className="mt-4 text-gray-700 max-w-2xl">{user.bio}</p>}
            </div>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Total Cleanups"
                value={stats.totalCleanups}
                icon={<Trash2 className="h-10 w-10" />}
                color="ocean"
              />
              <StatCard
                title="Trash Collected"
                value={stats.totalTrash}
                icon={<Award className="h-10 w-10" />}
                color="green"
              />
              <StatCard
                title="Distance"
                value={stats.totalDistance}
                icon={<MapPin className="h-10 w-10" />}
                color="blue"
              />
              <StatCard
                title="Global Rank"
                value={stats.rank}
                icon={<TrendingUp className="h-10 w-10" />}
                color="orange"
              />
              <StatCard
                title="Events Organized"
                value={stats.eventsOrganized}
                icon={<Calendar className="h-10 w-10" />}
                color="purple"
              />
              <StatCard
                title="Groups Joined"
                value={stats.groupsJoined}
                icon={<Users className="h-10 w-10" />}
                color="ocean"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </CardHeader>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(activity.date, { month: 'short', day: 'numeric' })}
                      </p>
                      {activity.type === 'cleanup' && (
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-1" />
                            {activity.trash}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {activity.distance}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {activity.participants}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge variant={activity.type === 'cleanup' ? 'success' : 'primary'}>
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            </CardHeader>
            <div className="p-6 space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                    achievement.earned
                      ? 'bg-ocean-50 border border-ocean-200'
                      : 'bg-gray-50 border border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    {achievement.earned && achievement.earnedDate && (
                      <p className="text-xs text-ocean-600 mt-1">
                        Earned {achievement.earnedDate}
                      </p>
                    )}
                    {!achievement.earned && achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>
                            {achievement.progress}/{achievement.target}
                          </span>
                          <span>
                            {calculatePercentage(achievement.progress, achievement.target)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-ocean-500 transition-all"
                            style={{
                              width: `${calculatePercentage(
                                achievement.progress,
                                achievement.target
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress to Next Milestone */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Next Milestone</h2>
            </CardHeader>
            <div className="p-6">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-ocean-600">{nextMilestone}</p>
                <p className="text-sm text-gray-600">Total Cleanups Goal</p>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{stats.totalCleanups} completed</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ocean-500 to-ocean-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {nextMilestone - stats.totalCleanups} more cleanups to reach your goal!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

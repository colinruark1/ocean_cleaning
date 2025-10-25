/**
 * Mock data service for development
 * This will be replaced with real API calls in production
 */

export const mockUser = {
  id: '1',
  name: 'Alex Rivera',
  email: 'alex@oceanclean.com',
  location: 'Santa Monica, CA',
  joined: 'January 2024',
  bio: 'Ocean lover and environmental advocate committed to protecting our beaches',
  avatar: null,
};

export const mockStats = {
  totalCleanups: 24,
  totalTrash: '342 lbs',
  totalDistance: '45.2 km',
  rank: '#127',
  eventsOrganized: 3,
  groupsJoined: 5,
};

export const mockActivities = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'completed a cleanup',
    location: 'Venice Beach, CA',
    distance: '2.3 km',
    trash: '45 lbs',
    time: '2 hours ago',
    participants: 8,
  },
  {
    id: 2,
    user: 'Mike Chen',
    action: 'joined an event',
    location: 'Santa Monica Pier',
    distance: '1.8 km',
    trash: '32 lbs',
    time: '5 hours ago',
    participants: 12,
  },
  {
    id: 3,
    user: 'Ocean Warriors',
    action: 'created a new group',
    location: 'Malibu Coast',
    distance: '3.5 km',
    trash: '68 lbs',
    time: '1 day ago',
    participants: 15,
  },
];

export const mockEvents = [
  {
    id: 1,
    title: 'Weekend Beach Cleanup',
    location: 'Santa Monica Beach',
    date: '2025-10-27',
    time: '9:00 AM',
    participants: 24,
    maxParticipants: 50,
    description: 'Join us for a morning of cleaning our beautiful beach!',
    organizer: 'Ocean Warriors',
    difficulty: 'Easy',
  },
  {
    id: 2,
    title: 'Coastal Conservation Day',
    location: 'Malibu Shores',
    date: '2025-10-28',
    time: '7:00 AM',
    participants: 18,
    maxParticipants: 30,
    description: 'Early morning cleanup focusing on marine debris.',
    organizer: 'Save Our Seas',
    difficulty: 'Moderate',
  },
  {
    id: 3,
    title: 'Family Beach Day Cleanup',
    location: 'Venice Beach',
    date: '2025-11-01',
    time: '10:00 AM',
    participants: 32,
    maxParticipants: 60,
    description: 'Family-friendly event with activities for kids!',
    organizer: 'Clean Coast Initiative',
    difficulty: 'Easy',
  },
];

export const mockGroups = [
  {
    id: 1,
    name: 'Ocean Warriors',
    description: 'Dedicated to protecting our oceans through regular beach cleanups and conservation efforts.',
    members: 156,
    cleanups: 42,
    trash: '2,340 lbs',
    category: 'Local Community',
    image: 'ocean',
  },
  {
    id: 2,
    name: 'Beach Guardians',
    description: 'Making a difference one cleanup at a time. Join us every weekend!',
    members: 89,
    cleanups: 28,
    trash: '1,450 lbs',
    category: 'Environmental',
    image: 'beach',
  },
  {
    id: 3,
    name: 'Youth for Clean Seas',
    description: 'Student-led initiative focusing on environmental education and action.',
    members: 234,
    cleanups: 56,
    trash: '3,120 lbs',
    category: 'Youth',
    image: 'youth',
  },
  {
    id: 4,
    name: 'Corporate Cleanup Crew',
    description: 'Professional volunteers making environmental impact through teamwork.',
    members: 67,
    cleanups: 15,
    trash: '980 lbs',
    category: 'Corporate',
    image: 'corporate',
  },
];

export const mockAchievements = [
  {
    id: 1,
    title: 'First Cleanup',
    description: 'Complete your first beach cleanup',
    icon: '🏖️',
    earned: true,
    earnedDate: 'Jan 15, 2024',
  },
  {
    id: 2,
    title: 'Team Player',
    description: 'Join 5 different cleanup events',
    icon: '👥',
    earned: true,
    earnedDate: 'Feb 3, 2024',
  },
  {
    id: 3,
    title: 'Trash Warrior',
    description: 'Collect 100 lbs of trash',
    icon: '♻️',
    earned: true,
    earnedDate: 'Mar 12, 2024',
  },
  {
    id: 4,
    title: 'Marathon Cleaner',
    description: 'Cover 50 km in cleanups',
    icon: '🏃',
    earned: false,
    progress: 45.2,
    target: 50,
  },
  {
    id: 5,
    title: 'Group Leader',
    description: 'Organize 10 cleanup events',
    icon: '⭐',
    earned: false,
    progress: 3,
    target: 10,
  },
  {
    id: 6,
    title: 'Ocean Protector',
    description: 'Complete 50 cleanups',
    icon: '🌊',
    earned: false,
    progress: 24,
    target: 50,
  },
];

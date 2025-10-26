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
    coordinates: { lat: 34.0195, lng: -118.4912 },
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
    coordinates: { lat: 34.0259, lng: -118.7798 },
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
    coordinates: { lat: 33.9850, lng: -118.4695 },
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

export const mockPosts = [
  {
    id: 1,
    author: {
      id: '2',
      name: 'Sarah Johnson',
      avatar: null,
    },
    caption: 'Amazing morning at Venice Beach! Collected 45 lbs of trash with the Ocean Warriors team. Every piece counts! 🌊♻️',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format',
        alt: 'Beach cleanup in action',
      },
    ],
    location: 'Venice Beach, CA',
    likes: 124,
    likedByUser: false,
    comments: [
      {
        id: 1,
        author: {
          id: '3',
          name: 'Mike Chen',
          avatar: null,
        },
        text: 'Great work! Wish I could have joined you today',
        timestamp: '2 hours ago',
      },
      {
        id: 2,
        author: {
          id: '1',
          name: 'Alex Rivera',
          avatar: null,
        },
        text: 'Amazing effort! Keep it up 💪',
        timestamp: '1 hour ago',
      },
    ],
    timestamp: '3 hours ago',
    createdAt: '2025-10-25T09:00:00Z',
  },
  {
    id: 2,
    author: {
      id: '4',
      name: 'Emma Davis',
      avatar: null,
    },
    caption: 'Family cleanup day was a huge success! Teaching the kids about ocean conservation. They collected more trash than me! 😊🏖️',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format',
        alt: 'Family beach cleanup',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1591856419248-fce59d1638d0?w=800&auto=format',
        alt: 'Kids helping with cleanup',
      },
    ],
    location: 'Santa Monica Beach',
    likes: 203,
    likedByUser: true,
    comments: [
      {
        id: 3,
        author: {
          id: '5',
          name: 'David Lee',
          avatar: null,
        },
        text: 'This is so heartwarming! Great job teaching them young',
        timestamp: '4 hours ago',
      },
    ],
    timestamp: '6 hours ago',
    createdAt: '2025-10-25T06:00:00Z',
  },
  {
    id: 3,
    author: {
      id: '6',
      name: 'Ocean Warriors',
      avatar: null,
    },
    caption: 'Check out this time-lapse of our beach transformation! Before and after shots show the incredible impact we made together. 🌊✨',
    media: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1583675467814-e408c8a8bfbf?w=800&auto=format',
        alt: 'Beach cleanup timelapse',
      },
    ],
    location: 'Malibu Shores',
    likes: 456,
    likedByUser: true,
    comments: [
      {
        id: 4,
        author: {
          id: '7',
          name: 'Lisa Park',
          avatar: null,
        },
        text: 'Wow! The difference is incredible',
        timestamp: '1 day ago',
      },
      {
        id: 5,
        author: {
          id: '8',
          name: 'James Wilson',
          avatar: null,
        },
        text: 'Proud to be part of this team!',
        timestamp: '1 day ago',
      },
      {
        id: 6,
        author: {
          id: '1',
          name: 'Alex Rivera',
          avatar: null,
        },
        text: 'This is inspiring! When is the next cleanup?',
        timestamp: '20 hours ago',
      },
    ],
    timestamp: '1 day ago',
    createdAt: '2025-10-24T10:00:00Z',
  },
  {
    id: 4,
    author: {
      id: '9',
      name: 'Carlos Rodriguez',
      avatar: null,
    },
    caption: 'Found some interesting things during today\'s cleanup! Including this message in a bottle from 2019. 📝🍾',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584464367916-f8e0aaa83e3c?w=800&auto=format',
        alt: 'Message in a bottle',
      },
    ],
    location: 'Laguna Beach',
    likes: 89,
    likedByUser: false,
    comments: [],
    timestamp: '2 days ago',
    createdAt: '2025-10-23T14:30:00Z',
  },
  {
    id: 5,
    author: {
      id: '10',
      name: 'Youth for Clean Seas',
      avatar: null,
    },
    caption: 'Our student volunteers made an incredible impact this weekend! 156 participants, 340 lbs of trash collected. The future is bright! 🌟',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format',
        alt: 'Youth volunteers at beach',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format',
        alt: 'Group photo of volunteers',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format',
        alt: 'Collected trash bags',
      },
    ],
    location: 'Newport Beach',
    likes: 312,
    likedByUser: false,
    comments: [
      {
        id: 7,
        author: {
          id: '11',
          name: 'Rachel Green',
          avatar: null,
        },
        text: 'So proud of these kids! 💙',
        timestamp: '3 days ago',
      },
    ],
    timestamp: '3 days ago',
    createdAt: '2025-10-22T11:00:00Z',
  },
];

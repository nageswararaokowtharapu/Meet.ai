// Mock data for Meet.ai demo purposes

export interface Bill {
  id: string;
  biller: string;
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid';
}

export interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export interface BoredSuggestion {
  id: string;
  type: 'netflix' | 'spotify' | 'local';
  title: string;
  description: string;
  action: string;
}

export const mockBills: Bill[] = [
  {
    id: '1',
    biller: 'Netflix',
    amount: 15.99,
    dueDate: '2025-09-08',
    status: 'upcoming'
  },
  {
    id: '2',
    biller: 'Electric Company',
    amount: 127.50,
    dueDate: '2025-09-10',
    status: 'upcoming'
  },
  {
    id: '3',
    biller: 'Internet Provider',
    amount: 79.99,
    dueDate: '2025-09-12',
    status: 'upcoming'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Team Standup',
    startTime: '2025-09-05T09:00:00',
    endTime: '2025-09-05T09:30:00',
    location: 'Conference Room A'
  },
  {
    id: '2',
    title: 'Client Presentation',
    startTime: '2025-09-05T14:00:00',
    endTime: '2025-09-05T15:00:00',
    location: 'Zoom Meeting'
  },
  {
    id: '3',
    title: 'Project Review',
    startTime: '2025-09-05T16:30:00',
    endTime: '2025-09-05T17:30:00',
    location: 'Office'
  }
];

export const boredSuggestions: BoredSuggestion[] = [
  {
    id: '1',
    type: 'netflix',
    title: 'Watch "The Crown" Season 6',
    description: 'Continue your royal drama binge',
    action: 'Open Netflix'
  },
  {
    id: '2',
    type: 'spotify',
    title: 'Discover Weekly Playlist',
    description: 'New music recommendations just for you',
    action: 'Open Spotify'
  },
  {
    id: '3',
    type: 'local',
    title: 'Coffee at Blue Bottle',
    description: '5 min walk • Open until 6 PM',
    action: 'Get Directions'
  },
  {
    id: '4',
    type: 'netflix',
    title: 'Documentary: "Our Planet"',
    description: 'Nature documentary series',
    action: 'Open Netflix'
  },
  {
    id: '5',
    type: 'local',
    title: 'Yoga Class at Mindful Studio',
    description: 'Next class starts in 30 minutes',
    action: 'Book Class'
  }
];

export const getRandomSuggestions = (count: number = 3): BoredSuggestion[] => {
  const shuffled = [...boredSuggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getTodaysMeetings = (): Meeting[] => {
  const today = new Date().toDateString();
  return mockMeetings.filter(meeting => 
    new Date(meeting.startTime).toDateString() === today
  );
};

export const getUpcomingBills = (days: number = 7): Bill[] => {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return mockBills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    return dueDate >= now && dueDate <= future && bill.status === 'upcoming';
  });
};

export const getFreeTimeSlots = (): string[] => {
  const meetings = getTodaysMeetings();
  const slots = [];
  
  if (meetings.length === 0) {
    return ['All day free'];
  }
  
  // Simple logic for demo - show gaps between meetings
  const now = new Date();
  const currentHour = now.getHours();
  
  if (currentHour < 9) {
    slots.push('8:00 AM - 9:00 AM');
  }
  if (currentHour < 14) {
    slots.push('12:00 PM - 2:00 PM (Lunch break)');
  }
  if (currentHour < 17) {
    slots.push('5:30 PM - 6:30 PM');
  }
  
  return slots.length > 0 ? slots : ['No free time today'];
};
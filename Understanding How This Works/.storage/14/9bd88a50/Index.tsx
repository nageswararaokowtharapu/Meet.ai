import { useState, useEffect } from 'react';
import GoogleAuth from '@/components/GoogleAuth';
import Dashboard from './Dashboard';
import { GoogleUser, googleApiService } from '@/lib/googleApi';

export default function Index() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = googleApiService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleAuthChange = (newUser: GoogleUser | null) => {
    setUser(newUser);
  };

  const handleSignOut = () => {
    setUser(null);
    googleApiService.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onSignOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="text-center mb-8 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Meet.ai
          </h1>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-md">
          Your personal + family life manager powered by Gmail & Google Calendar
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Daily Digest</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Smart Reminders</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Entertainment Suggestions</span>
          </div>
        </div>
      </div>

      <GoogleAuth onAuthChange={handleAuthChange} />

      <div className="mt-8 text-center text-xs text-muted-foreground max-w-md">
        <p>
          Meet.ai is your AI-powered life concierge that helps you stay organized 
          by connecting to your Gmail and Google Calendar with read-only permissions.
        </p>
      </div>
    </div>
  );
}
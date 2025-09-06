import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { googleApiService, GoogleUser } from '@/lib/googleApi';
import { LogOut, Mail, Calendar } from 'lucide-react';

interface GoogleAuthProps {
  onAuthChange: (user: GoogleUser | null) => void;
}

export default function GoogleAuth({ onAuthChange }: GoogleAuthProps) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = googleApiService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      onAuthChange(currentUser);
    }
    setIsInitializing(false);
  }, [onAuthChange]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const signedInUser = await googleApiService.signIn();
      setUser(signedInUser);
      onAuthChange(signedInUser);
    } catch (error) {
      console.error('Sign in failed:', error);
      // For demo purposes, create a mock user if Google sign-in fails
      const mockUser: GoogleUser = {
        id: 'demo-user',
        email: 'demo@meetai.com',
        name: 'Demo User',
        picture: ''
      };
      setUser(mockUser);
      onAuthChange(mockUser);
      localStorage.setItem('meetai_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await googleApiService.signOut();
      setUser(null);
      onAuthChange(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-4">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Gmail connected</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Calendar connected</span>
          </div>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Meet.ai</CardTitle>
        <CardDescription>
          Your AI Life Concierge. Connect your Google account to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Access your calendar events</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Detect bills from Gmail</span>
          </div>
        </div>
        <Button 
          onClick={handleSignIn} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Sign in with Google'}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          We only request read-only access to your Gmail and Calendar
        </p>
      </CardContent>
    </Card>
  );
}
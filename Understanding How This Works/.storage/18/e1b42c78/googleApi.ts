// Google APIs integration for Meet.ai

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        init: (config: any) => Promise<any>;
        getAuthInstance: () => any;
      };
    };
  }
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
  location?: string;
}

class GoogleApiService {
  private isInitialized = false;
  private accessToken: string | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-client-id',
            scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly'
          }).then(() => {
            this.isInitialized = true;
            resolve();
          }).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<GoogleUser> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    const googleUser = await authInstance.signIn();
    const profile = googleUser.getBasicProfile();
    
    this.accessToken = googleUser.getAuthResponse().access_token;
    
    const user: GoogleUser = {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl()
    };

    // Store user info in localStorage for demo
    localStorage.setItem('meetai_user', JSON.stringify(user));
    localStorage.setItem('meetai_access_token', this.accessToken);
    
    return user;
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return;
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    
    this.accessToken = null;
    localStorage.removeItem('meetai_user');
    localStorage.removeItem('meetai_access_token');
  }

  getCurrentUser(): GoogleUser | null {
    const userStr = localStorage.getItem('meetai_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isSignedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('meetai_access_token');
    }

    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${today.toISOString()}&` +
        `timeMax=${tomorrow.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Return mock data for demo if API fails
      return [
        {
          id: 'mock-1',
          summary: 'Team Meeting (Demo)',
          start: { dateTime: new Date().toISOString() },
          end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
          location: 'Conference Room'
        }
      ];
    }
  }

  async getGmailMessages(): Promise<unknown[]> {
    // For demo purposes, we'll return mock data
    // In a real implementation, this would parse Gmail for bills
    console.log('Gmail integration would parse emails for bills here');
    return [];
  }
}

export const googleApiService = new GoogleApiService();
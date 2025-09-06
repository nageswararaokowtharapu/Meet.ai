import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Clock, MapPin, Bell } from 'lucide-react';
import { mockMeetings, mockBills, getFreeTimeSlots, getUpcomingBills, getTodaysMeetings } from '@/lib/mockData';
import { googleApiService } from '@/lib/googleApi';

export default function DailyDigest() {
  const [meetings, setMeetings] = useState(getTodaysMeetings());
  const [bills, setBills] = useState(getUpcomingBills());
  const [freeSlots, setFreeSlots] = useState(getFreeTimeSlots());
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch real calendar events
      if (googleApiService.isSignedIn()) {
        const calendarEvents = await googleApiService.getCalendarEvents();
        if (calendarEvents.length > 0) {
          const formattedMeetings = calendarEvents.map(event => ({
            id: event.id,
            title: event.summary,
            startTime: event.start.dateTime || event.start.date || '',
            endTime: event.end.dateTime || event.end.date || '',
            location: event.location
          }));
          setMeetings(formattedMeetings);
        }
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Digest</h2>
        <Button 
          onClick={refreshData} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Meetings
            </CardTitle>
            <CardDescription>
              {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No meetings today</p>
            ) : (
              meetings.map((meeting) => (
                <div key={meeting.id} className="border-l-2 border-blue-500 pl-3 space-y-1">
                  <h4 className="font-medium">{meeting.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Upcoming Bills
            </CardTitle>
            <CardDescription>
              Next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bills.length === 0 ? (
              <p className="text-muted-foreground text-sm">No bills due soon</p>
            ) : (
              bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <h4 className="font-medium">{bill.biller}</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(bill.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${bill.amount}</p>
                    <Badge variant={bill.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Free Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Free Time
            </CardTitle>
            <CardDescription>
              Available slots today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {freeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{slot}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Smart Reminders Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Smart Reminders Active
          </CardTitle>
          <CardDescription>
            We'll notify you 30-40 minutes before meetings and 3-7 days before bills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Meeting reminders: ON</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Bill reminders: ON</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
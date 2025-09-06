import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Clock, DollarSign, X } from 'lucide-react';
import { getTodaysMeetings, getUpcomingBills } from '@/lib/mockData';

interface Reminder {
  id: string;
  type: 'meeting' | 'bill';
  title: string;
  message: string;
  time: string;
  dismissed: boolean;
}

export default function ReminderSystem() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and get permission
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          setNotificationsEnabled(permission === 'granted');
        });
      }
    }

    // Generate mock reminders based on today's data
    generateReminders();

    // Set up periodic reminder checks (every minute for demo)
    const interval = setInterval(checkForReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateReminders = () => {
    const meetings = getTodaysMeetings();
    const bills = getUpcomingBills();
    const newReminders: Reminder[] = [];

    // Meeting reminders (30-40 minutes before)
    meetings.forEach(meeting => {
      const meetingTime = new Date(meeting.startTime);
      const reminderTime = new Date(meetingTime.getTime() - 35 * 60 * 1000);
      
      newReminders.push({
        id: `meeting-${meeting.id}`,
        type: 'meeting',
        title: meeting.title,
        message: `Meeting "${meeting.title}" starts in 35 minutes`,
        time: reminderTime.toISOString(),
        dismissed: false
      });
    });

    // Bill reminders (3-7 days before)
    bills.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 7 && daysUntilDue >= 3) {
        newReminders.push({
          id: `bill-${bill.id}`,
          type: 'bill',
          title: `${bill.biller} Bill Due`,
          message: `${bill.biller} bill ($${bill.amount}) due in ${daysUntilDue} days`,
          time: today.toISOString(),
          dismissed: false
        });
      }
    });

    setReminders(newReminders);
  };

  const checkForReminders = () => {
    const now = new Date();
    
    reminders.forEach(reminder => {
      if (!reminder.dismissed) {
        const reminderTime = new Date(reminder.time);
        
        // Show reminder if it's time (within 1 minute window)
        if (Math.abs(now.getTime() - reminderTime.getTime()) < 60000) {
          showNotification(reminder);
        }
      }
    });
  };

  const showNotification = (reminder: Reminder) => {
    // Browser notification
    if (notificationsEnabled) {
      new Notification(reminder.title, {
        body: reminder.message,
        icon: '/favicon.svg',
        tag: reminder.id
      });
    }

    // Also show in-app notification (for demo)
    console.log(`Reminder: ${reminder.message}`);
  };

  const dismissReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, dismissed: true } : reminder
      )
    );
  };

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const activeReminders = reminders.filter(r => !r.dismissed);
  const upcomingReminders = reminders.filter(r => {
    const reminderTime = new Date(r.time);
    const now = new Date();
    return reminderTime > now && !r.dismissed;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Smart Reminders
          </CardTitle>
          <CardDescription>
            Automatic notifications for meetings and bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4" />
              <span className="text-sm">Browser Notifications</span>
            </div>
            {notificationsEnabled ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Enabled
              </Badge>
            ) : (
              <Button onClick={enableNotifications} size="sm" variant="outline">
                Enable
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Meeting Reminders
              </h4>
              <p className="text-sm text-muted-foreground">
                30-40 minutes before meetings
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Bill Reminders
              </h4>
              <p className="text-sm text-muted-foreground">
                3-7 days before due date
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>
              {upcomingReminders.length} reminder{upcomingReminders.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {reminder.type === 'meeting' ? (
                    <Clock className="w-4 h-4 text-blue-500" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-green-500" />
                  )}
                  <div>
                    <h5 className="font-medium">{reminder.title}</h5>
                    <p className="text-sm text-muted-foreground">{reminder.message}</p>
                  </div>
                </div>
                <Button
                  onClick={() => dismissReminder(reminder.id)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeReminders.length === 0 && upcomingReminders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Active Reminders</h3>
            <p className="text-sm text-muted-foreground">
              We'll notify you when you have upcoming meetings or bills
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
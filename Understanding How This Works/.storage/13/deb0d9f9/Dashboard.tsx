import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, Sparkles, Settings } from 'lucide-react';
import DailyDigest from '@/components/DailyDigest';
import BoredButton from '@/components/BoredButton';
import ReminderSystem from '@/components/ReminderSystem';
import { GoogleUser } from '@/lib/googleApi';

interface DashboardProps {
  user: GoogleUser;
  onSignOut: () => void;
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('digest');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Meet.ai
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name.split(' ')[0]}
              </span>
              <Button onClick={onSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="digest" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Digest</span>
            </TabsTrigger>
            <TabsTrigger value="bored" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Bored</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="digest" className="space-y-6">
            <DailyDigest />
          </TabsContent>

          <TabsContent value="bored" className="space-y-6">
            <BoredButton />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <ReminderSystem />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="max-w-2xl">
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Privacy Dashboard</h2>
                  <p className="text-muted-foreground">
                    Manage your connected accounts and data preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Connected Accounts</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Google Calendar</p>
                            <p className="text-sm text-muted-foreground">Read-only access</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-xs font-bold">G</span>
                          </div>
                          <div>
                            <p className="font-medium">Gmail</p>
                            <p className="text-sm text-muted-foreground">Read-only access</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Data & Privacy</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Data stored locally in browser</span>
                        <span className="text-green-600">✓ Secure</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>No data shared with third parties</span>
                        <span className="text-green-600">✓ Private</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Read-only access to your accounts</span>
                        <span className="text-green-600">✓ Safe</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                    <h3 className="font-medium mb-2 text-red-800">Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-3">
                      This will permanently delete all your data and disconnect all accounts.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
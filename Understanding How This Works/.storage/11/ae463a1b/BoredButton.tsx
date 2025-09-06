import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play, Music, MapPin, RefreshCw } from 'lucide-react';
import { getRandomSuggestions, BoredSuggestion } from '@/lib/mockData';

export default function BoredButton() {
  const [suggestions, setSuggestions] = useState<BoredSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleBoredClick = () => {
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      const newSuggestions = getRandomSuggestions(3);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setIsLoading(false);
    }, 1000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'netflix':
        return <Play className="w-4 h-4" />;
      case 'spotify':
        return <Music className="w-4 h-4" />;
      case 'local':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'netflix':
        return 'bg-red-100 text-red-800';
      case 'spotify':
        return 'bg-green-100 text-green-800';
      case 'local':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSuggestionClick = (suggestion: BoredSuggestion) => {
    // In a real app, this would open the respective app or service
    console.log(`Opening: ${suggestion.title}`);
    
    // Show a mock action for demo
    if (suggestion.type === 'netflix') {
      window.open('https://netflix.com', '_blank');
    } else if (suggestion.type === 'spotify') {
      window.open('https://spotify.com', '_blank');
    } else {
      alert(`Would open: ${suggestion.title}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            I'm Bored!
          </CardTitle>
          <CardDescription>
            Get personalized suggestions for entertainment and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleBoredClick}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Finding suggestions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                What should I do?
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Here are some ideas for you:</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {suggestions.map((suggestion) => (
              <Card 
                key={suggestion.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(suggestion.type)}>
                      {getIcon(suggestion.type)}
                      <span className="ml-1 capitalize">{suggestion.type}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{suggestion.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3">
                    {suggestion.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full">
                    {suggestion.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleBoredClick}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Get new suggestions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
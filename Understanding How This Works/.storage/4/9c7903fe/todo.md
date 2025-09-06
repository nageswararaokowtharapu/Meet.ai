# Meet.ai - AI Life Concierge MVP Development Plan

## Project Overview
Building a web-based AI Life Concierge that integrates with Gmail and Google Calendar to provide daily digests, smart reminders, and entertainment suggestions.

## MVP Features to Implement
1. Google OAuth authentication (Gmail + Calendar read-only access)
2. Daily Digest dashboard showing today's meetings, bills, and free time
3. Smart reminders system (mock notifications for web)
4. "I'm Bored" button with entertainment suggestions
5. Privacy dashboard for account management

## Files to Create/Modify

### 1. Core Pages & Components
- `src/pages/Index.tsx` - Landing page with Google sign-in
- `src/pages/Dashboard.tsx` - Main daily digest dashboard
- `src/pages/Privacy.tsx` - Privacy dashboard for account management
- `src/components/GoogleAuth.tsx` - Google OAuth integration component
- `src/components/DailyDigest.tsx` - Daily digest card component
- `src/components/BoredButton.tsx` - Entertainment suggestions component
- `src/components/ReminderSystem.tsx` - Mock notification system

### 2. Utilities & Services
- `src/lib/googleApi.ts` - Google APIs integration (Gmail, Calendar)
- `src/lib/mockData.ts` - Mock data for development/demo purposes

## Technical Implementation Strategy
- Use React with TypeScript and Shadcn-ui components
- Implement Google OAuth for authentication
- Create mock data for bills detection (since Gmail parsing requires backend)
- Use localStorage for demo data persistence
- Implement responsive design for mobile-friendly experience
- Focus on clean, modern UI with smooth interactions

## Simplified for MVP Success
- Mock bill detection instead of real Gmail parsing
- Use browser notifications instead of push notifications
- Static entertainment suggestions for "I'm Bored" feature
- Simple localStorage-based data management
- Focus on UI/UX demonstration over complex backend logic

## Success Criteria
- Working Google sign-in flow
- Functional daily digest with calendar integration
- Interactive "I'm Bored" suggestions
- Clean privacy dashboard
- Responsive, professional design
- All features working in web browser
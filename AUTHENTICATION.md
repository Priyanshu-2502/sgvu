# GlacierWatch Authentication System

## Overview
The GlacierWatch application now includes a comprehensive role-based authentication system with two user types: Local Users and Administrators.

## User Roles

### Local User
- **Access**: Home, About, Impact, Alert pages
- **Login**: Email, Phone, Password + OTP (fixed: 1234)
- **Navigation**: Limited to public-facing features

### Administrator
- **Access**: All pages including Dashboard, Risk Map, Monitoring
- **Login**: Admin ID and Password (admin / admin123)
- **Navigation**: Full access to all features including admin-only pages

## Authentication Flow

1. **Default Route**: All users are redirected to `/login` by default
2. **Login Page**: Fullscreen background slideshow with role selection
3. **Session Management**: Uses localStorage for session persistence
4. **Route Protection**: All pages are protected and redirect unauthorized users
5. **Role-based Navigation**: Navigation menu changes based on user role

## Demo Credentials

### Local User
- **Email**: Any valid email format
- **Phone**: Any phone number
- **Password**: Any password
- **OTP**: 1234

### Administrator
- **Admin ID**: admin
- **Password**: admin123

## New Features

### Monitoring Page (Admin Only)
- **Satellite Tab**: Sentinel-2 data analysis with band information (B02, B03, B04, B08)
- **Drone Tab**: Live flight status, GPS coordinates, temperature monitoring, video feed

### Navigation System
- **Dynamic Menu**: Changes based on user role
- **Logout Functionality**: Proper session cleanup
- **User Display**: Shows current user name in navigation

## Technical Implementation

### Components
- `AuthProvider`: Context provider for authentication state
- `ProtectedRoute`: HOC for route protection
- `Navigation`: Role-based navigation component

### Pages Updated
- All existing pages now use the authentication system
- Login page completely redesigned with fullscreen slideshow
- New monitoring page for admin users

### Security Features
- Route protection prevents unauthorized access
- Role-based access control
- Session persistence with localStorage
- Automatic redirects for unauthorized users

## Usage

1. Start the application: `npm run dev`
2. Navigate to any route - you'll be redirected to login
3. Choose your role (Local User or Admin)
4. Enter the appropriate credentials
5. Access features based on your role

## File Structure
```
app/
├── login/page.tsx          # New login page with slideshow
├── monitoring/page.tsx     # New admin-only monitoring page
├── page.tsx               # Updated with auth protection
├── dashboard/page.tsx     # Updated with admin-only access
├── alerts/page.tsx        # Updated with auth protection
├── about/page.tsx         # Updated with auth protection
├── impacts/page.tsx       # Updated with auth protection
└── risk-map/page.tsx      # Updated with admin-only access

components/
├── navigation.tsx         # Role-based navigation
└── protected-route.tsx    # Route protection HOC

lib/
└── auth-context.tsx       # Authentication context provider
```

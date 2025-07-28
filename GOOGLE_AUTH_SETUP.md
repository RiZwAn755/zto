# Google OAuth Authentication Setup

## Prerequisites

1. **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Add your domain to authorized origins (for development: `http://localhost:5173`)
   - Add your redirect URIs

## Environment Variables

### Backend (.env)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_BASE_URL=http://localhost:3000
```

## Installation

### Backend
```bash
cd backend
npm install google-auth-library
```

### Frontend
```bash
cd frontend
npm install @react-oauth/google
```

## Features Implemented

1. **Google Login/Signup:** Users can authenticate using their Google account
2. **JWT Token Authentication:** Secure token-based authentication without sessions
3. **Automatic User Creation:** New users are automatically created when they sign up with Google
4. **Profile Picture Support:** Google profile pictures are saved to the user account
5. **Role-based Access:** Supports both student and admin roles

## API Endpoints

- `POST /auth/google/google` - Google OAuth authentication
- `POST /auth/google/verify` - Verify Google token

## How It Works

1. User clicks "Continue with Google" button
2. Google OAuth popup opens for authentication
3. After successful authentication, Google returns a credential token
4. Frontend sends the token to backend for verification
5. Backend verifies the token with Google and creates/retrieves user
6. JWT token is generated and returned to frontend
7. User is logged in and redirected based on their role

## Security Features

- JWT tokens with 7-day expiration
- Google token verification on backend
- Secure password handling for OAuth users
- Role-based access control 
# WatchNext

WatchNext is a comprehensive movie and TV show tracking application that solves the common problem of losing track of viewing progress across multiple streaming platforms. The application enables users to maintain detailed watchlists, track episodes watched, add personal notes and ratings, and receive notifications about new seasons and sequels.

## Problem Statement

With the proliferation of streaming services and the abundance of content available, users often struggle to remember which episodes they've watched, which shows have new seasons available, or which movies they've already seen. WatchNext addresses these pain points by providing a centralized platform for managing viewing history and discovering new content.

## Key Features

### Core Functionality
- **User Authentication**: Secure registration and login system with JWT tokens
- **Watchlist Management**: Add movies and TV shows to personalized lists
- **Episode Tracking**: Track progress through TV series with season and episode details
- **Personal Notes**: Add custom notes and ratings for watched content
- **Progress Visualization**: Dashboard showing viewing statistics and progress
- **Smart Recommendations**: Algorithm-based suggestions for what to watch next

### Advanced Features
- **New Season Alerts**: Automatic notifications when new seasons of tracked shows are released
- **Sequel Tracking**: Identification of movie franchises and sequel releases
- **Genre Analysis**: Personalized genre preferences based on viewing history
- **Time Tracking**: Calculate total hours watched across all content
- **Export Functionality**: Download viewing history and statistics

## Technical Architecture

### Frontend Stack
- **React 19**: Modern React with latest features and performance optimizations
- **Vite**: Fast build tool and development server
- **React Router v7**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Context API**: Global state management for authentication and user data

### Backend Stack
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework with middleware support
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcryptjs**: Password hashing for security
- **express-validator**: Input validation and sanitization

### Database
- **MongoDB**: NoSQL document database for flexible data storage
- **Mongoose ODM**: Schema validation and middleware support

### External APIs
- **TMDB API**: The Movie Database for comprehensive movie and TV show data
- **Image CDN**: Optimized poster and backdrop image delivery

## Project Structure

```
WatchNext/
├── backend/                 # Express.js API server
│   ├── config/             # Environment configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware (auth, validation)
│   ├── models/            # Mongoose schemas (User, WatchList)
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic and external API integration
│   └── utils/             # Utility functions
├── frontend/              # React application
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── contexts/     # React Context providers
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Route components
│       ├── services/     # API client and data fetching
│       └── utils/        # Helper functions
└── docs/                 # Project documentation
```

## Current Implementation Status

### Completed Features
- **Authentication System**: Complete JWT-based authentication with refresh tokens
- **User Management**: Registration, login, profile management with validation
- **Database Integration**: MongoDB connection with Mongoose schemas
- **Frontend UI**: Responsive design with Tailwind CSS and component library
- **API Architecture**: RESTful API with proper error handling and validation
- **Security**: Password hashing, CORS configuration, rate limiting

### In Development
- **WatchList Model**: Database schema for tracking movies and TV shows
- **TMDB Integration**: Movie and TV show search and details API
- **Dashboard Analytics**: User statistics and viewing progress visualization

### Planned Features
- **Episode Tracking**: Detailed TV show progress tracking
- **Notification System**: New season and sequel alerts
- **Recommendation Engine**: Personalized content suggestions
- **Social Features**: Share watchlists and reviews
- **Mobile Application**: React Native companion app

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Media (TMDB Integration)
- `GET /api/media/popular` - Popular movies and TV shows
- `GET /api/media/trending` - Trending content
- `GET /api/media/search` - Search movies and TV shows
- `GET /api/media/movie/:id` - Movie details
- `GET /api/media/tv/:id` - TV show details

### User Data (Planned)
- `GET /api/watchlist` - User's watchlist
- `POST /api/watchlist` - Add item to watchlist
- `PUT /api/watchlist/:id` - Update watchlist item
- `DELETE /api/watchlist/:id` - Remove from watchlist

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or Atlas cloud)
- TMDB API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/username/watchnext.git
cd watchnext
```

2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Backend `.env` file:
```env
JWT_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/watchnext
TMDB_API_KEY=your_tmdb_api_key
CORS_ORIGIN=http://localhost:5173
```

## Security Considerations

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Short-lived access tokens with refresh mechanism
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Rate Limiting**: API request throttling to prevent abuse
- **Environment Variables**: Sensitive data stored securely

## Performance Optimizations

- **Frontend**: Vite build tool for fast development and optimized production builds
- **Backend**: Express.js with compression and caching middleware
- **Database**: MongoDB indexing for efficient queries
- **Images**: TMDB CDN for optimized image delivery
- **API**: Request/response compression and efficient data structures

## Future Enhancements

### Technical Improvements
- **Caching Layer**: Redis for frequently accessed data
- **Search Optimization**: Elasticsearch for advanced search capabilities
- **Real-time Updates**: WebSocket integration for live notifications
- **Microservices**: Break down monolith into focused services

### Feature Additions
- **Machine Learning**: Content recommendation algorithms
- **Social Integration**: User reviews and social sharing
- **Offline Support**: Progressive Web App capabilities
- **Multi-platform**: Mobile and desktop applications

## Contributing

This project demonstrates full-stack development skills including:
- Modern React development with hooks and context
- RESTful API design and implementation
- Database design and optimization
- Authentication and authorization
- Responsive web design
- Testing and deployment strategies

## License

MIT License - see LICENSE file for details
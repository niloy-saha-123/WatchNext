# WatchNext Backend

Backend API server for the WatchNext movie/TV tracking application.

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── config.js        # Environment and app configuration
├── controllers/         # Route controllers (future use)
├── middleware/          # Custom middleware (future use)
├── models/              # Database models (future use)
├── routes/              # API route definitions
│   └── mediaRoutes.js   # TMDB media endpoints
├── services/            # Business logic and external APIs
│   └── tmdbService.js   # TMDB API integration
├── utils/               # Utility functions (future use)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── server.js            # Main server file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- TMDB API key (get from [The Movie Database](https://www.themoviedb.org/settings/api))

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   JWT_SECRET=super-secret-jwt-key-change-this-in-production
   TMDB_API_KEY=your_tmdb_api_key_here
   # OR
   TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
   ```

3. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start at `http://localhost:3001`

## 📖 API Endpoints

### Health Check
- `GET /health` - Server health status

### Media (TMDB Integration)
- `GET /api/media/popular?type=movie|tv&page=1` - Popular movies/shows
- `GET /api/media/trending?type=all|movie|tv&time=day|week` - Trending content
- `GET /api/media/search?q=query&page=1` - Search movies/shows
- `GET /api/media/movie/:id` - Movie details
- `GET /api/media/tv/:id` - TV show details
- `GET /api/media/featured` - Featured content for homepage

### API Documentation
- `GET /api` - Full API documentation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3001 |
| `HOST` | Server host | No | localhost |
| `NODE_ENV` | Environment | No | development |
| `JWT_SECRET` | JWT signing secret | **Yes** | - |
| `TMDB_API_KEY` | TMDB API key | Yes* | - |
| `TMDB_READ_ACCESS_TOKEN` | TMDB read token | Yes* | - |
| `CORS_ORIGIN` | Allowed CORS origin | No | http://localhost:5180 |

*Either `TMDB_API_KEY` or `TMDB_READ_ACCESS_TOKEN` is required for TMDB features.

## 🔐 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Input Validation** - Request validation (when implemented)
- **JWT Authentication** - Secure user authentication (when implemented)

## 📊 Monitoring

- **Morgan** - HTTP request logging
- **Health Check** - `/health` endpoint for monitoring
- **Error Handling** - Centralized error handling

## 🚧 Future Development

The following features are planned for future implementation:

### Database Integration
- PostgreSQL database setup
- User authentication & registration
- User watch history tracking
- Favorite genres calculation
- Personal ratings and notes

### Additional Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - User profile
- `POST /api/user/movies` - Add watched movie
- `POST /api/user/shows` - Add tracked show

### Features
- Real-time statistics calculation
- Personal recommendations
- Social features (friends, sharing)
- Export/import watch history

## 🔗 Frontend Integration

The backend is designed to work with the WatchNext React frontend. The frontend communicates with this backend through:

- **Base URL**: `http://localhost:3001/api`
- **CORS**: Configured for frontend origin
- **JSON API**: All endpoints return JSON responses

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📝 Contributing

1. Follow the established folder structure
2. Add proper JSDoc comments to functions
3. Use environment variables for configuration
4. Implement proper error handling
5. Write tests for new features

## 🆘 Troubleshooting

### TMDB API Issues
- Verify your API key is correct
- Check rate limits (TMDB allows 40 requests per 10 seconds)
- Ensure the API key has proper permissions

### CORS Issues
- Check the `CORS_ORIGIN` environment variable
- Verify frontend is running on the expected port

### Port Issues
- Change the `PORT` environment variable if 3001 is in use
- Update frontend's `VITE_API_BASE_URL` to match
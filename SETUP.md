# WatchNext - Authentication Setup Guide

## 🚀 **Quick Setup Commands**

### **1. Generate JWT Secret**
```bash
# Navigate to backend directory
cd backend

# Generate JWT secret (choose one method)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# OR
openssl rand -hex 32
```

### **2. Create Backend .env File**
```bash
# Create .env file in backend directory
cat > .env << EOF
# Server Configuration
PORT=3001
HOST=localhost
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_generated_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/watchnext

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5180
EOF
```

### **3. Install Backend Dependencies**
```bash
cd backend
npm install
```

### **4. Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### **5. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔧 **Environment Variables Explained**

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing JWT tokens | `a1b2c3d4e5f6...` |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration time | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `7d` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/watchnext` |
| `TMDB_API_KEY` | TMDB API key for movie data | `your_api_key_here` |

## 🗄️ **Database Setup**

### **Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# macOS with Homebrew:
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Create database
mongosh
> use watchnext
```

### **Option 2: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🎬 **TMDB API Setup**

1. Go to [TMDB API](https://www.themoviedb.org/settings/api)
2. Create account and request API key
3. Add API key to `.env` file

## 🧪 **Testing Authentication**

### **Test Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "birthday": "1990-01-01"
  }'
```

### **Test Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔐 **Security Notes**

- **Never commit `.env` files** to version control
- **Use strong JWT secrets** (64+ characters)
- **Rotate secrets regularly** in production
- **Use HTTPS** in production
- **Set proper CORS origins** for production

## 🚨 **Troubleshooting**

### **Backend Issues:**
- Check MongoDB connection
- Verify JWT secret is set
- Check TMDB API key
- Ensure all dependencies installed

### **Frontend Issues:**
- Check API base URL in browser network tab
- Verify CORS settings
- Check browser console for errors
- Ensure backend is running

### **Common Errors:**
- `MongoDB connection error` → Check MONGODB_URI
- `JWT secret not found` → Add JWT_SECRET to .env
- `CORS error` → Check CORS_ORIGIN setting
- `TMDB API error` → Verify TMDB_API_KEY

## 🎯 **Next Steps**

After setup is complete:
1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Test token refresh
4. ✅ Test protected routes
5. ✅ Test logout functionality

Your WatchNext authentication system is now ready! 🎉

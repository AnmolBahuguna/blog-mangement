# Blog Management System

A comprehensive blog management platform built with Node.js, Express, and MongoDB. This application provides a robust backend for creating, managing, and publishing blog content with user authentication and RESTful API endpoints.

## 🚀 Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Blog CRUD Operations**: Create, read, update, and delete blog posts
- **User Management**: Admin and user role-based access control
- **Content Management**: Rich text editing and categorization
- **API Documentation**: RESTful API with proper error handling
- **Security**: Password hashing with bcryptjs and CORS protection

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, CORS, Helmet
- **Environment**: dotenv for configuration management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in your `.env` file:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blog-management
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the MongoDB server** (if running locally)
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Blog Posts
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get a specific blog post
- `POST /api/blogs` - Create a new blog post (authenticated)
- `PUT /api/blogs/:id` - Update a blog post (authenticated/author)
- `DELETE /api/blogs/:id` - Delete a blog post (authenticated/author)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

## 🏗️ Project Structure

```
blog-management/
├── controllers/          # Route controllers
├── models/              # MongoDB models
├── routes/              # API routes
├── middleware/          # Custom middleware
├── config/              # Configuration files
├── utils/               # Utility functions
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Package dependencies
└── server.js            # Application entry point
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Cross-Origin Resource Sharing configured
- **Input Validation**: Request body validation and sanitization
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a blog post
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "category": "Technology"
  }'
```

## 🚀 Deployment

### Environment Variables for Production
```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-management
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

### Deploy to Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### Deploy to Vercel
```bash
# Install Vercel CLI
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




## 🔮 Future Enhancements

- [ ] Email notifications for new posts
- [ ] Comment system for blog posts
- [ ] Image upload functionality
- [ ] Search and filtering capabilities
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Multi-language support

---

**Built with ❤️ by Anmol Bahuguna 
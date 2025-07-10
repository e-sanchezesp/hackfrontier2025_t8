# Elder Care

A comprehensive care and wellness application for elderly people with React Native frontend and Express.js backend.

## Project Structure

```
elder-care/
├── frontend/                 # React Native (Expo) application
│   ├── app/                 # Expo Router pages
│   ├── components/          # Reusable React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── assets/             # Images and static files
│   ├── package.json        # Frontend dependencies
│   └── app.json           # Expo configuration
├── backend/                # Express.js API server
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration files
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Main server file
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── package.json           # Root monorepo configuration
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (for frontend development)
- MongoDB (for backend database)

### Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

### Development

#### Run both frontend and backend simultaneously:
```bash
npm run dev
```

#### Run frontend only:
```bash
npm run dev:frontend
```

#### Run backend only:
```bash
npm run dev:backend
```

### Production

#### Build both applications:
```bash
npm run build
```

#### Start both applications:
```bash
npm start
```

## Frontend (React Native + Expo)

The frontend is built with:
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **Expo Router** - File-based routing
- **TypeScript** - Type safety

### Key Features:
- File-based routing with Expo Router
- Reusable components
- Context-based state management
- Custom hooks for business logic

### Available Scripts:
- `npm run dev` - Start development server
- `npm run build:web` - Build for web
- `npm run lint` - Run linter

## Backend (Express.js)

The backend is built with:
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### API Endpoints:

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Alarms
- `GET /api/alarms` - Get all alarms
- `POST /api/alarms` - Create new alarm
- `PUT /api/alarms/:id` - Update alarm
- `DELETE /api/alarms/:id` - Delete alarm

### Available Scripts:
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

## Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/elder-care
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 
# Museum  management REST-API 

A comprehensive RESTful API server for a digital museum platform, providing content management, user authentication, booking systems, and community forum features with real-time capabilities.

## Overview

This API serves as the backend infrastructure for a museum's digital presence, enabling visitors to explore historical content, book tours, engage in community discussions, and access gallery collections through a modern web platform.

## Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.0+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ (supports local and Neon serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **File Storage**: Cloudinary via Multer
- **Validation**: Zod
- **Real-time**: WebSocket (ws library)
- **Session Management**: express-session with PostgreSQL store

## Features

### Core Functionality

- **Authentication & Authorization**: Secure user registration and login with role-based access control (visitor, attendant, admin)
- **Historical Content Management**: Rich educational content with SEO-optimized routing and slug-based URLs
- **Gallery Management**: Categorized image collections with metadata and Cloudinary integration
- **Booking System**: Tour reservations with real-time status updates via WebSocket
- **Community Forum**: Interactive discussions with post likes, comments, and attendant-only sections
- **Contact Management**: Visitor inquiry handling and communication system
- **Admin Features**: Administrative functions for content and user management

### Technical Features

- Full TypeScript implementation with strict type checking
- Zod schema validation for request/response data
- Drizzle ORM with PostgreSQL support
- Cross-platform database support (local PostgreSQL and Neon serverless)
- Secure session handling with PostgreSQL session store
- Advanced querying with pagination, filtering, and relationship queries
- Connection pooling and efficient database operations
- Rate limiting for login attempts
- Comprehensive error handling middleware
- Request logging and monitoring

## Architecture

### Database Schema

- **Users**: Authentication and profile management with role-based access
- **History Content**: Educational articles and historical information
- **Gallery Items**: Museum artifact and exhibition images with categorization
- **Bookings**: Tour reservations and visitor management
- **Forum Posts & Comments**: Community engagement platform with likes
- **Contact Messages**: Visitor communication system
- **Groups**: Forum group management with attendant-only access control

### API Structure

```
/api/v1
├── /auth          # Authentication endpoints
├── /history       # Historical content management
├── /gallery       # Gallery and media management
├── /bookings      # Tour booking system
├── /forum         # Community forum features
├── /contact       # Contact form and messaging
├── /admin         # Administrative functions
├── /users         # User profile management
└── /ws            # WebSocket real-time communication
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL 15+ (local) or Neon account (serverless)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd badagry_backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/museum
   # or for Neon: postgresql://user:pass@host/db?sslmode=require
   
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # Session Secret
   SESSION_SECRET=your-super-secret-session-key
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   API_PROD_URL=http://localhost:5001
   ```

4. **Database setup**
   ```bash
   # Generate and run migrations
   pnpm run db:generate
   pnpm run db:migrate

   # Sync the database
   pnpm run db:push
   
   # Optional: Seed with sample data
   pnpm run db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm run dev
   ```

The API will be available at `http://localhost:5001/api/v1`

## API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login         # User login
POST /api/v1/auth/logout        # User logout
GET  /api/v1/auth/profile       # Get user profile
PUT  /api/v1/auth/profile       # Update user profile
```

### Historical Content

```http
GET    /api/v1/history              # List all historical content
GET    /api/v1/history/:id          # Get content by ID
GET    /api/v1/history/slug/:slug   # Get content by slug
POST   /api/v1/history              # Create new content (admin only)
PUT    /api/v1/history/:id          # Update content (admin only)
DELETE /api/v1/history/:id          # Delete content (admin only)
```

### Gallery Management

```http
GET  /api/v1/gallery                    # List all gallery items
GET  /api/v1/gallery/:id                # Get gallery item by ID
GET  /api/v1/gallery/category/:category # Get items by category
POST /api/v1/gallery                    # Add new gallery item (admin only)
PUT  /api/v1/gallery/:id                # Update gallery item (admin only)
```

### Booking System

```http
GET  /api/v1/bookings           # List user bookings
GET  /api/v1/bookings/:id       # Get booking details
POST /api/v1/bookings           # Create new booking
PUT  /api/v1/bookings/:id       # Update booking status (attendant/admin)
```

### Forum Features

```http
GET  /api/v1/forum/posts        # List forum posts
GET  /api/v1/forum/posts/:id    # Get post with comments
POST /api/v1/forum/posts        # Create new post
POST /api/v1/forum/comments     # Add comment to post
POST /api/v1/forum/likes        # Like/unlike a post
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {
    "total": 100,
    "hasMore": true,
    "offset": 0,
    "limit": 20
  }
}
```

## Configuration

### Database Configuration

The system supports both local PostgreSQL and Neon serverless databases:

- **Local Development**: Uses `pg` with connection pooling
- **Production**: Supports Neon serverless with WebSocket configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment mode | development |
| `SESSION_SECRET` | Session encryption key | Required |
| `FRONTEND_URL` | CORS allowed origin | http://localhost:3000 |
| `API_PROD_URL` | Production server URI | http://localhost:5001 |

## Development

### Available Scripts

```bash
pnpm run dev          # Start development server with hot reload
pnpm run build        # Build TypeScript to JavaScript
pnpm run start        # Start production server
pnpm run check        # Type check without emitting files
pnpm run lint         # Run ESLint
pnpm run test         # Run tests
pnpm run db:generate  # Generate database migrations
pnpm run db:migrate   # Run database migrations
pnpm run db:push      # Push schema changes to database
pnpm run db:seed      # Seed database with sample data
pnpm run db:reset     # Reset database
```

### Project Structure

```
.
├── config/           # Configuration files
│   ├── auth/         # Authentication configuration
│   ├── bucket-storage/ # File upload configuration
│   ├── cors/         # CORS configuration
│   └── database/     # Database connection and schema
├── middlewares/      # Express middlewares
│   └── errors/       # Error handling
├── server/
│   ├── controllers/  # Request handlers
│   ├── routes/       # Route definitions
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── dist/             # Compiled JavaScript
├── drizzle/          # Database migrations
└── logs/             # Application logs
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run linting
pnpm run lint
```

## Deployment

### Local Deployment

```bash
pnpm run build
pnpm start
```

### Cloud Deployment

The API is optimized for deployment on:
- Render (serverless functions)
- Other Node.js hosting platforms

### Development Guidelines

- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use conventional commit messages
- Update documentation for new features
- Ensure backward compatibility
- Follow RESTful API design principles

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Rate limiting on login endpoints
- CORS configuration
- Input validation with Zod
- SQL injection prevention via Drizzle ORM
- Secure session cookies

## License

This project is licensed under the MIT License.

## Support

For questions, issues, or contributions, please refer to the project repository or contact the development team.

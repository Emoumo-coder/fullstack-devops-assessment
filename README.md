
# Form Builder Application

A full-stack dynamic form builder application that allows users to create, manage, and customize forms with a drag-and-drop interface. Built with React/Next.js frontend, Laravel backend, and Docker containerization.

## Live Demo

**URL**: 

**Test Credentials**:
- email: demo@example.com
- password: demo1237

 - email: john@example.com,
- password: password123

paostman docs: https://documenter.getpostman.com/view/28328497/2sB3WmS2SV
## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Local Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd form-builder
   \`\`\`

2. **Start all services**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Run database migrations**
   \`\`\`bash
   docker-compose exec backend php artisan migrate
   \`\`\`

4. **Create a test user (optional)**
   \`\`\`bash
   docker-compose exec backend php artisan tinker
   >>> User::create(['name' => 'Demo User', 'email' => 'demo@example.com', 'password' => Hash::make('demo1237')])
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Database: localhost:3306 (MySQL)

### Stopping Services
\`\`\`bash
docker-compose down
\`\`\`

### Viewing Logs
\`\`\`bash
docker-compose logs -f backend
docker-compose logs -f frontend
\`\`\`

## API Documentation

### Base URL
\`\`\`
http://localhost:8000/api
\`\`\`

### Authentication Endpoints

#### Register User
\`\`\`http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
\`\`\`

**Response (201)**:
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
\`\`\`

#### Login User
\`\`\`http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
\`\`\`

#### Get Current User
\`\`\`http
GET /api/me
Authorization: Bearer {token}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

#### Logout User
\`\`\`http
POST /api/logout
Authorization: Bearer {token}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "message": "Logout successful"
}
\`\`\`

#### Refresh Token
\`\`\`http
POST /api/refresh
Authorization: Bearer {token}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
\`\`\`

### Form Management Endpoints

#### List All Forms
\`\`\`http
GET /api/forms
Authorization: Bearer {token}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Membership Application",
      "description": "Apply for membership",
      "structure": {
        "sections": [
          {
            "id": "section-1",
            "title": "Personal Details",
            "groups": [
              {
                "id": "group-1",
                "title": "Your Personal Details",
                "fields": [
                  {
                    "id": "field-1",
                    "label": "First Name",
                    "type": "text",
                    "required": true
                  }
                ]
              }
            ]
          }
        ]
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### Create New Form
\`\`\`http
POST /api/forms
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Membership Application",
  "description": "Apply for membership",
  "structure": {
    "sections": [
      {
        "id": "section-1",
        "title": "Personal Details",
        "groups": []
      }
    ]
  }
}
\`\`\`

**Response (201)**:
\`\`\`json
{
  "success": true,
  "message": "Form created successfully",
  "data": {
    "id": 1,
    "title": "Membership Application",
    "description": "Apply for membership",
    "structure": {...},
    "created_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

#### Get Specific Form
\`\`\`http
GET /api/forms/{id}
Authorization: Bearer {token}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Membership Application",
    "description": "Apply for membership",
    "structure": {...},
    "created_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

#### Update Form
\`\`\`http
PUT /api/forms/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "structure": {...}
}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "message": "Form updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated description",
    "structure": {...},
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

#### Delete Form
\`\`\`http
DELETE /api/forms/{id}
Authorization: Bearer {token}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "message": "Form deleted successfully"
}
\`\`\`

## Frontend Features

### Authentication
- User registration with email and password
- Secure login with JWT token storage
- Automatic token refresh
- Protected routes for authenticated users
- Logout functionality

### Form Builder
- **Create Forms**: Start new forms with custom titles and descriptions
- **Drag-and-Drop Interface**: Intuitive form structure management
- **Sections & Groups**: Organize forms hierarchically
- **Field Types**: Support for 8 different field types:
  - Text Input
  - Email Input
  - Phone Number
  - Radio Buttons
  - Checkboxes
  - Select Dropdown
  - Date Picker
  - File Upload

### Form Management
- **List View**: See all created forms in a dashboard
- **Edit Forms**: Modify form structure and fields
- **Delete Forms**: Remove forms permanently
- **Save Forms**: Auto-save functionality with backend persistence
- **Real-time Updates**: Instant UI updates when forms change

### User Experience
- Clean, modern interface with teal/green accent colors
- Responsive design for desktop and tablet
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Intuitive field configuration panel

## Technical Decisions

### Frontend Architecture
- **Framework**: Next.js 16 with React 19
- **State Management**: React Context API for authentication, local state for form builder
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **HTTP Client**: Custom API client with JWT token management
- **Why**: Next.js provides excellent performance, SSR capabilities, and built-in optimizations. React Context is sufficient for this application's state needs.

### Backend Architecture
- **Framework**: Laravel 10
- **Authentication**: JWT (JSON Web Tokens) via tymon/jwt-auth
- **Database**: MySQL with Eloquent ORM
- **API Design**: RESTful with consistent JSON response format
- **Why**: Laravel provides robust authentication, validation, and ORM out of the box. JWT is stateless and perfect for API authentication.

### Database Design
- **Users Table**: Standard authentication with email uniqueness
- **Forms Table**: Stores form metadata and JSON structure
- **Structure Column**: JSON column for flexible form structure storage
- **Why**: JSON column allows flexible form structure without complex normalization, while maintaining relational integrity for user-form relationships.

### Containerization
- **Docker Compose**: Multi-container setup with separate services
- **Services**: PHP-FPM, Nginx, MySQL, Redis
- **Why**: Ensures consistency across development and production environments, simplifies onboarding, and enables easy scaling.

## Deployment

### Recommended Platforms
- **Railway.app** - Simple deployment with automatic HTTPS


4. **Deploy**
   - Railway automatically detects Docker Compose
   - Services deploy automatically
   - Database migrations run on first deploy

5. **Access Your App**
   - Railway provides a public URL
   - HTTPS is automatically enabled

### Environment Variables

**Backend (.env)**
\`\`\`
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:919ymTRgcTFUcOFiLXxCHShMrWqPrw7lz2MWTyNco3Y=
APP_DEBUG=false
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=nozomi.proxy.rlwy.net
DB_PORT=19330
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=jeVLpXJetxQnuydCQhSyknssabrnmYKP

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
# CACHE_PREFIX=
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

JWT_SECRET=Jr6M5Uwvle9QCUzk1gcEzub7PEWlpLNAo8mNP7huIdqWe17rOvKexOLiSiR3nKkt

JWT_ALGO=HS256

\`\`\`

**Frontend (.env.local)**
\`\`\`
NEXT_PUBLIC_API_URL=https://form-builder-backend-production-e5f8.up.railway.app
\`\`\`

## Project Structure

\`\`\`
form-builder/
├── frontend/                 # Next.js React application
│   ├── app/
│   │   ├── page.tsx         # Main entry point
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── auth/            # Authentication components
│   │   └── form-builder/    # Form builder components
│   ├── lib/
│   │   ├── api-client.ts    # API communication
│   │   └── auth-context.tsx # Auth state management
│   └── package.json
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/ # API controllers
│   │   └── Models/          # Database models
│   ├── database/
│   │   └── migrations/      # Database migrations
│   ├── routes/
│   │   └── api.php          # API routes
│   ├── .env.example         # Environment template
│   └── composer.json
├── docker-compose.yml       # Multi-container orchestration
├── nginx.conf               # Nginx configuration
└── README.md               # This file
\`\`\`

## Known Limitations

### Current Implementation
- **Form Submissions**: Not implemented - forms are builder-only, not submission-ready
- **Form Versioning**: No version history or rollback functionality
- **Collaboration**: Single-user only, no real-time collaboration
- **Advanced Validations**: Basic field validation only, no custom validation rules
- **File Storage**: File upload fields configured but storage not implemented
- **Form Analytics**: No submission tracking or analytics
- **Conditional Logic**: No field dependencies or conditional visibility
- **Themes**: Single theme only, no customization options

### Why These Limitations
- **Scope**: These features would significantly increase complexity
- **Time**: MVP focuses on core form building functionality
- **Scalability**: Can be added incrementally without breaking existing code
- **User Feedback**: Better to gather feedback on core features first

### Future Enhancements
- Form submission and response collection
- Advanced field validation and conditional logic
- Multi-user collaboration with real-time updates
- Form templates and pre-built forms
- Analytics and reporting dashboard
- Custom CSS and theming
- API for embedding forms on external sites
- Mobile app for form filling

## Troubleshooting

### Database Connection Error
\`\`\`
Error: SQLSTATE[HY000] [2002] Connection refused
\`\`\`
**Solution**: Ensure MySQL container is running
\`\`\`bash
docker-compose ps
docker-compose restart db
\`\`\`

### JWT Token Expired
**Solution**: Token automatically refreshes on API calls. If manual refresh needed:
\`\`\`bash
POST /api/refresh
Authorization: Bearer {expired_token}
\`\`\`

### CORS Errors
**Solution**: Check `CORS_ALLOWED_ORIGINS` in backend `.env`
\`\`\`
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
\`\`\`

### Frontend Can't Connect to Backend
**Solution**: Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
\`\`\`
NEXT_PUBLIC_API_URL=https://form-builder-backend-production-e5f8.up.railway.app
\`\`\`

## Development

### Running Tests
\`\`\`bash
# Backend tests
docker-compose exec backend php artisan test

# Frontend tests
docker-compose exec frontend npm test
\`\`\`

### Code Standards
- Backend: PSR-12 PHP coding standards
- Frontend: ESLint and Prettier configuration included

### Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request


>>>>>>> 4f29a71 (Initial commit)

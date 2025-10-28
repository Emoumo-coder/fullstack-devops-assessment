# Form Builder Application

## Live Demo
**URL**: [https://form-builder-production-65d3.up.railway.app/](https://form-builder-production-65d3.up.railway.app/)
**Backend URL**: [https://form-builder-server-production.up.railway.app/](https://form-builder-server-production.up.railway.app/)

**Test Credentials**:
- Email: demo@example.com
- Password: demo123

## Overview
A full-stack Dynamic Form Builder application that allows users to create custom forms through an intuitive drag-and-drop interface. Built with React frontend, Laravel backend API, and containerized deployment using Docker.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Local Development
```bash
# Clone the repository
git clone https://github.com/Emoumo-coder/fullstack-devops-assessment.git
cd fullstack-devops-assessment

# Start all services
docker-compose up -d

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:8000
```

### Services
- **Frontend**: React app on port 3000
- **Backend**: Laravel API on port 8000  
- **Database**: MySQL on port 3306

## 🛠️ API Documentation

### Authentication Endpoints

#### POST /api/register
Register a new user

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "message": "User registered successfully"
}
```

#### POST /api/login
Authenticate user

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Demo User",
      "email": "demo@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "message": "Login successful"
}
```

#### POST /api/logout
Logout user

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/user
Get authenticated user details

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Demo User",
      "email": "demo@example.com"
    }
  },
  "message": "User details retrieved successfully"
}
```

### Form Management Endpoints

#### GET /api/forms
List all forms for authenticated user

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "forms": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Contact Form",
        "description": "Sample contact form",
        "structure": {
          "sections": [
            {
              "id": "section_1",
              "title": "Personal Information",
              "groups": [
                {
                  "id": "group_1",
                  "title": "Basic Info",
                  "fields": [
                    {
                      "id": "field_1",
                      "type": "text",
                      "label": "First Name",
                      "required": true
                    }
                  ]
                }
              ]
            }
          ]
        },
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  },
  "message": "Forms retrieved successfully"
}
```

#### POST /api/forms
Create a new form

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "New Form",
  "description": "Form description",
  "structure": {
    "sections": [
      {
        "id": "section_1",
        "title": "Section 1",
        "groups": [
          {
            "id": "group_1",
            "title": "Group 1",
            "fields": []
          }
        ]
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "form": {
      "id": 2,
      "user_id": 1,
      "title": "New Form",
      "description": "Form description",
      "structure": {
        "sections": [...]
      },
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  },
  "message": "Form created successfully"
}
```

#### GET /api/forms/{id}
Get specific form details

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "form": {
      "id": 1,
      "user_id": 1,
      "title": "Contact Form",
      "description": "Sample contact form",
      "structure": {...},
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  },
  "message": "Form retrieved successfully"
}
```

#### PUT /api/forms/{id}
Update form structure

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated Form Title",
  "description": "Updated description",
  "structure": {
    "sections": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "form": {
      "id": 1,
      "user_id": 1,
      "title": "Updated Form Title",
      "description": "Updated description",
      "structure": {...},
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  },
  "message": "Form updated successfully"
}
```

#### DELETE /api/forms/{id}
Delete a form

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Form deleted successfully"
}
```

### Error Responses
All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

## Frontend Features

### Implemented Features
- **User Authentication** - Secure login/registration with JWT
- **Form Management** - Create, view, and manage forms
- **Drag & Drop Interface** - Intuitive form building experience
- **Section & Group Management** - Organize form elements logically
- **Multiple Field Types**:
  - Text inputs (Name, Email, etc.)
  - Radio buttons (Yes/No options)
  - Checkboxes (Multiple selections)
  - File upload with drag-and-drop
  - Date pickers
  - Select dropdowns

### User Workflow
1. **Authenticate** - Login to access form builder
2. **Create Form** - Add sections and groups
3. **Drag & Drop** - Add form elements from sidebar
4. **Save & Preview** - Persist forms and preview functionality

## Technical Decisions

### Architecture
- **Frontend**: React 18 with functional components and hooks
- **State Management**: Redux Toolkit for predictable state
- **Styling**: SCSS with Ant Design components
- **Drag & Drop**: @dnd-kit for modern, accessible interactions
- **Backend**: Laravel 12 with RESTful API design
- **Authentication**: Laravel Sanctum for API tokens
- **Database**: MySQL with JSON column for form structure

### Key Technical Choices
1. **Component-Based Architecture** - Reusable, maintainable components
2. **Containerized Deployment** - Consistent environments with Docker
3. **JSON Form Storage** - Flexible form structure in database
4. **Responsive Design** - Mobile-first approach with Ant Design
5. **Error Handling** - Comprehensive client and server-side validation

## Deployment

### Platform: Railway.app
**Why Railway**:
- Docker-native platform perfect for multi-service applications
- Free tier with 500 hours/month + $5 credit
- Automatic HTTPS and database provisioning
- Easy GitHub integration with auto-deploys

### Deployment Steps
1. **Connect Repository** - Link GitHub repo to Railway
2. **Auto-Detection** - Railway detects docker-compose.yml
3. **Environment Setup** - Automatic database and environment variables
4. **Live Deployment** - Application deployed with public URL

### Environment Variables
```env
# Backend
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=[auto-provided]
DB_DATABASE=[auto-provided]
DB_USERNAME=[auto-provided]
DB_PASSWORD=[auto-provided]

# Frontend
VITE_API_URL=[railway-backend-url]/api
```

## Implementation Status

### Completed (Must Have)
- [x] User authentication (login/register)
- [x] Create and save forms
- [x] Retrieve saved forms
- [x] Basic form structure (sections → groups → fields)
- [x] Drag and drop for multiple field types
- [x] Docker setup with docker-compose
- [x] Live deployment with persistent database

### Additional Features Implemented
- [x] Form preview functionality
- [x] Real-time form editing
- [x] Field validation and error handling
- [x] Responsive design
- [x] Professional UI/UX with Ant Design

## ⚠️ Known Limitations & Design Decisions

### Strategic Design Choices
**Note on Figma Implementation**: I deliberately chose not to implement pixel-perfect Figma matching to demonstrate core functionality and technical capabilities within the time constraints. The focus was on building a robust, functional form builder with proper architecture rather than exact visual replication.

### Current Scope Limitations
1. **No Form Deletion** - Forms can be created but not deleted in UI (backend API supports deletion)
2. **Limited Field Validation** - Basic validation implemented; advanced validation scenarios not covered
3. **No Undo/Redo** - Advanced editing features intentionally excluded to focus on core functionality
4. **Basic Error Handling** - Comprehensive error scenarios not fully covered; core error handling implemented

### Technical Constraints
- Free tier hosting limitations (memory/CPU constraints)
- No advanced form analytics or reporting
- Limited file upload size based on hosting platform
- Simplified state management for rapid development

## Time Spent
- **Total Development Time**: ~35 hours
- **Frontend**: 20 hours
- **Backend**: 10 hours  
- **DevOps & Deployment**: 5 hours

## Trade-offs & Simplifications

### Made for Time Constraints
1. **Separate Services** - Deployed frontend, backend, and database as separate Railway services for reliability
2. **Basic CI/CD** - Manual deployment instead of full GitHub Actions pipeline
3. **Simplified State** - Used Redux Toolkit instead of more complex state solutions
4. **Standard Components** - Leveraged Ant Design for rapid UI development
5. **Functional Over Visual** - Prioritized working functionality over pixel-perfect Figma matching

### Focus Areas
- Core form builder functionality
- Reliable authentication system
- Clean, maintainable code structure
- Production-ready deployment
- API design and documentation

## Development Commands

### Backend (Laravel)
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
# Development
docker-compose up -d

# Production build
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support

For any issues with the deployed application or questions about implementation, please refer to the GitHub repository or contact me through sandaumaru207@gmail.com.

---

**Built with ❤️ using React, Laravel, and Docker**
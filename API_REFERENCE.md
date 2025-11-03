# API Reference

Complete API documentation for the Form Builder application.

## Base URL

\`\`\`
 https://form-builder-backend-production-e5f8.up.railway.app/api
\`\`\`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer {token}
\`\`\`

## Response Format

All API responses follow this format:

\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
\`\`\`

## Error Responses

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
\`\`\`

## Endpoints

### Authentication

#### POST /register
Register a new user.

**Request**:
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
\`\`\`

**Response** (201):
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
\`\`\`

**Errors**:
- 422: Validation failed (email already exists, password too short, etc.)
- 500: Server error

---

#### POST /login
Authenticate user and receive JWT token.

**Request**:
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
\`\`\`

**Errors**:
- 401: Invalid credentials
- 422: Validation failed
- 500: Server error

---

#### GET /me
Get authenticated user details.

**Headers**:
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response** (200):
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors**:
- 401: Unauthorized (invalid or missing token)
- 500: Server error

---

#### POST /logout
Invalidate current JWT token.

**Headers**:
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response** (200):
\`\`\`json
{
  "success": true,
  "message": "Logout successful"
}
\`\`\`

**Errors**:
- 401: Unauthorized
- 500: Server error

---

#### POST /refresh
Refresh JWT token.

**Headers**:
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response** (200):
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
\`\`\`

**Errors**:
- 401: Unauthorized
- 500: Server error

---

### Forms

#### GET /forms
List all forms for authenticated user.

**Headers**:
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Query Parameters**:
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default: 15)

**Response** (200):
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
                  },
                  {
                    "id": "field-2",
                    "label": "Last Name",
                    "type": "text",
                    "required": true
                  },
                  {
                    "id": "field-3",
                    "label": "Email Address",
                    "type": "email",
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

**Errors**:
- 401: Unauthorized
- 500: Server error

---

#### POST /forms
Create a new form.

**Headers**:
\`\`\`
Authorization: Bearer {token}
Content-Type: application/json
\`\`\`

**Request**:
\`\`\`json
{
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
            "fields": []
          }
        ]
      }
    ]
  }
}
\`\`\`

**Response** (201):
\`\`\`json
{
  "success": true,
  "message": "Form created successfully",
  "data": {
    "id": 1,
    "title": "Membership Application",
    "description": "Apply for membership",
    "structure": {...},
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors**:
- 401: Unauthorized
- 422: Validation failed (title required, invalid JSON structure)
- 500: Server error

---

#### GET /forms/{id}
Get specific form details.

**Headers**:
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response** (200):
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Membership Application",
    "description": "Apply for membership",
    "structure": {...},
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors**:
- 401: Unauthorized
- 404: Form not found
- 500: Server error

---

#### PUT /forms/{id}
Update form details and structure.

**Headers**:
\`\`\`
Authorization: Bearer {token}
Content-Type: application/json
\`\`\`

**Request**:
\`\`\`json
{
  "title": "Updated Title",
  "description": "Updated description",
  "structure": {
    "sections": [...]
  }
}
\`\`\`

**Response** (200):
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

**Errors**:
- 401: Unauthorized
- 404: Form not found
- 422: Validation failed
- 500: Server error

---

#### DELETE /forms/{id}
Delete a form.

**Headers**:
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response** (200):
\`\`\`json
{
  "success": true,
  "message": "Form deleted successfully"
}
\`\`\`

**Errors**:
- 401: Unauthorized
- 404: Form not found
- 500: Server error

---

## Field Types

Supported field types in form structure:

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text input | Name, Address |
| `email` | Email input with validation | Email Address |
| `phone` | Phone number input | Phone Number |
| `radio` | Radio button group | Yes/No, Gender |
| `checkbox` | Checkbox group | Interests, Agreements |
| `select` | Dropdown select | Country, State |
| `date` | Date picker | Date of Birth |
| `file` | File upload | Document, Photo |

---

## Form Structure Schema

\`\`\`json
{
  "sections": [
    {
      "id": "section-1",
      "title": "Section Title",
      "groups": [
        {
          "id": "group-1",
          "title": "Group Title",
          "fields": [
            {
              "id": "field-1",
              "label": "Field Label",
              "type": "text",
              "required": true,
              "placeholder": "Enter text",
              "options": []
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request format |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing:
- 100 requests per minute per user
- 1000 requests per hour per user

---

## Pagination

List endpoints support pagination:

\`\`\`
GET /api/forms?page=1&per_page=15
\`\`\`

Response includes pagination metadata:
\`\`\`json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 50,
    "last_page": 4
  }
}
\`\`\`

---

## Examples

### Complete Workflow

1. **Register User**
\`\`\`bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
\`\`\`

2. **Create Form**
\`\`\`bash
curl -X POST http://localhost:8000/api/forms \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Form",
    "description": "My first form",
    "structure": {"sections": []}
  }'
\`\`\`

3. **Update Form**
\`\`\`bash
curl -X PUT http://localhost:8000/api/forms/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Form",
    "structure": {
      "sections": [{
        "id": "s1",
        "title": "Section 1",
        "groups": []
      }]
    }
  }'
\`\`\`

4. **List Forms**
\`\`\`bash
curl -X GET http://localhost:8000/api/forms \
  -H "Authorization: Bearer {token}"
\`\`\`

5. **Delete Form**
\`\`\`bash
curl -X DELETE http://localhost:8000/api/forms/1 \
  -H "Authorization: Bearer {token}"
\`\`\`

---

## Support

For API issues:
- Check error messages in response
- Review this documentation
- Check application logs
- Open GitHub issue

# Form Builder - Setup Instructions

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
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend container
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript config
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/ # API controllers
│   │   └── Models/          # Database models
│   ├── database/
│   │   └── migrations/      # Database migrations
│   ├── routes/
│   │   └── api.php          # API routes
│   ├── Dockerfile           # Backend container
│   ├── .env.example         # Environment template
│   └── composer.json        # PHP dependencies
├── docker-compose.yml       # Multi-container orchestration
├── nginx.conf               # Nginx reverse proxy config
├── README.md                # Main documentation
├── DEPLOYMENT.md            # Deployment guide
├── API_REFERENCE.md         # API documentation
└── QUICK_REFERENCE.md       # Quick command reference
\`\`\`

## Technology Stack

### Frontend
- **Next.js 16** - React framework with SSR
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Component library
- **SWR** - Data fetching and caching

### Backend
- **Laravel 10+** - PHP framework
- **PHP 8.2+** - Programming language
- **MySQL 8.0+** - Database
- **JWT Auth** - Token-based authentication
- **RESTful API** - API design pattern

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and web server
- **GitHub Actions** - CI/CD pipeline

## Prerequisites

### System Requirements
- **OS**: macOS, Linux, or Windows (with WSL2)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk**: 10GB free space
- **Internet**: Required for downloading dependencies

### Required Software
- **Docker Desktop** (includes Docker and Docker Compose)
  - [Download for Mac](https://www.docker.com/products/docker-desktop)
  - [Download for Windows](https://www.docker.com/products/docker-desktop)
  - [Download for Linux](https://docs.docker.com/engine/install/)
- **Git** - Version control
  - [Download Git](https://git-scm.com/downloads)
- **Code Editor** (optional but recommended)
  - [VS Code](https://code.visualstudio.com/)
  - [WebStorm](https://www.jetbrains.com/webstorm/)

## Quick Start (5 Minutes)

### 1. Clone Repository
\`\`\`bash
git clone <your-repository-url>
cd form-builder
\`\`\`

### 2. Start Docker Services
\`\`\`bash
docker-compose up -d
\`\`\`

### 3. Run Migrations
\`\`\`bash
docker-compose exec backend php artisan migrate
\`\`\`

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: https://form-builder-backend-production-e5f8.up.railway.app/api

### 5. Test Login
- email: demo@example.com
- password: demo1237

## Detailed Setup Instructions

### Step 2: Create Environment Files

**Backend**
\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

**Frontend**
\`\`\`bash
cp frontend/.env.example frontend/.env.local
\`\`\`

### Step 3: Configure Environment Variables

**backend/.env** (default values work for local development)
\`\`\`bash
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

**frontend/.env.local**
\`\`\`bash
NEXT_PUBLIC_API_URL=https://form-builder-backend-production-e5f8.up.railway.app
\`\`\`

### Step 4: Start Docker Services
\`\`\`bash
docker-compose up -d
\`\`\`

This starts:
- **Frontend** (Next.js) on port 3000
- **Backend** (Laravel) on port 8000
- **Database** (MySQL) on port 3306
- **Redis** on port 6379
- **Nginx** on port 80

### Step 5: Run Database Migrations
\`\`\`bash
docker-compose exec backend php artisan migrate
\`\`\`

### Step 6: Create Test User (Optional)
\`\`\`bash
docker-compose exec backend php artisan tinker
>>> User::create(['name' => 'Demo User', 'email' => 'demo@example.com', 'password' => Hash::make('demo1237')])
>>> exit
\`\`\`

### Step 7: Verify Installation
\`\`\`bash
# Check all services are running
docker-compose ps

# Test API
curl http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1237"}'
\`\`\`

## Development Workflow

### Running Services
\`\`\`bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
\`\`\`

### Backend Development

**Run Migrations**
\`\`\`bash
docker-compose exec backend php artisan migrate
\`\`\`

**Create Migration**
\`\`\`bash
docker-compose exec backend php artisan make:migration create_table_name
\`\`\`

**Rollback Migrations**
\`\`\`bash
docker-compose exec backend php artisan migrate:rollback
\`\`\`

**Fresh Migration (Reset Database)**
\`\`\`bash
docker-compose exec backend php artisan migrate:fresh
\`\`\`

**Run Tests**
\`\`\`bash
docker-compose exec backend php artisan test
\`\`\`

**Clear Cache**
\`\`\`bash
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
\`\`\`

**Interactive Shell (Tinker)**
\`\`\`bash
docker-compose exec backend php artisan tinker
\`\`\`

### Frontend Development

**Install Dependencies**
\`\`\`bash
docker-compose exec frontend npm install
\`\`\`

**Run Development Server**
\`\`\`bash
docker-compose exec frontend npm run dev
\`\`\`

**Build for Production**
\`\`\`bash
docker-compose exec frontend npm run build
\`\`\`

**Run Tests**
\`\`\`bash
docker-compose exec frontend npm test
\`\`\`

**Lint Code**
\`\`\`bash
docker-compose exec frontend npm run lint
\`\`\`

### Database Management

**Access MySQL**
\`\`\`bash
docker-compose exec db mysql -u form_builder_user -pform_builder_password form_builder
\`\`\`

**Backup Database**
\`\`\`bash
docker-compose exec db mysqldump -u form_builder_user -pform_builder_password form_builder > backup.sql
\`\`\`

**Restore Database**
\`\`\`bash
docker-compose exec -T db mysql -u form_builder_user -pform_builder_password form_builder < backup.sql
\`\`\`

## API Integration

### Base URL
- Development: \`http://localhost:8000/api\`
- Production: \`https://your-domain.com/api\`

### Authentication
All protected endpoints require JWT token:
\`\`\`
Authorization: Bearer <token>
\`\`\`

### Response Format
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
\`\`\`

### Example API Call
\`\`\`bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create Form (replace TOKEN)
curl -X POST http://localhost:8000/api/forms \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Form",
    "description": "Test form",
    "structure": {"sections": []}
  }'
\`\`\`

## Debugging

### Enable Debug Mode
\`\`\`bash
# Edit backend/.env
APP_DEBUG=true
\`\`\`

### View Application Logs
\`\`\`bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f db
\`\`\`

### Check Service Status
\`\`\`bash
docker-compose ps
\`\`\`

### Rebuild Services
\`\`\`bash
docker-compose build --no-cache
docker-compose up -d
\`\`\`

### Common Issues

**Port Already in Use**
\`\`\`bash
# Find process using port
lsof -i :3000
lsof -i :8000

# Kill process
kill -9 <PID>
\`\`\`

**Database Connection Error**
\`\`\`bash
# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
\`\`\`

**Container Won't Start**
\`\`\`bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache
docker-compose up -d
\`\`\`

## IDE Setup

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Thunder Client** (for API testing)
- **Docker**
- **PHP Intelephense**
- **Laravel Blade Snippets**

### WebStorm Configuration
- Enable Docker integration
- Configure PHP interpreter from Docker
- Set up Laravel plugin
- Configure Node.js interpreter

## Git Workflow

### Create Feature Branch
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

### Make Changes and Commit
\`\`\`bash
git add .
git commit -m "feat: add your feature"
\`\`\`

### Push to Remote
\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

### Create Pull Request
- Go to GitHub
- Create pull request
- Wait for CI/CD checks
- Request review
- Merge after approval

## Testing

### Backend Tests
\`\`\`bash
docker-compose exec backend php artisan test
\`\`\`

### Frontend Tests
\`\`\`bash
docker-compose exec frontend npm test
\`\`\`

### API Testing with cURL
\`\`\`bash
# Test endpoint
curl -X GET http://localhost:8000/api/forms \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## Performance Tips

1. **Use Docker volumes** for faster file access
2. **Enable caching** in Laravel
3. **Use Redis** for sessions
4. **Optimize database queries**
5. **Enable gzip compression** in Nginx
6. **Use CDN** for static assets

## Next Steps

1. Read [README.md](README.md) for project overview
2. Read [API_REFERENCE.md](API_REFERENCE.md) for API documentation
3. Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
4. Start building features!

## Support & Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Happy coding! 🚀**

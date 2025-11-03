# Form Builder - Deployment Guide

## Local Development with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Git

### Quick Start

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd form-builder
\`\`\`

2. Create environment files
\`\`\`bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
\`\`\`

3. Update backend environment variables
\`\`\`bash
# backend/.env
DB_HOST=db
DB_PORT=3306
DB_DATABASE=form_builder
DB_USERNAME=form_builder_user
DB_PASSWORD=form_builder_password
JWT_SECRET=your-secret-key-here
CORS_ALLOWED_ORIGINS=http://localhost:3000
\`\`\`

4. Start the application
\`\`\`bash
docker-compose up -d
\`\`\`

5. Run database migrations
\`\`\`bash
docker-compose exec backend php artisan migrate
\`\`\`

6. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Nginx Proxy: http://localhost

### Stopping the Application
\`\`\`bash
docker-compose down
\`\`\`

### Viewing Logs
\`\`\`bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
\`\`\`

## Production Deployment

### Recommended Platforms

#### Railway.app (Recommended - Easiest)
**Why**: Simple deployment, automatic HTTPS, free tier available, excellent documentation

1. **Connect GitHub Repository**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize and select your repository

2. **Configure Services**
   - Railway auto-detects docker-compose.yml
   - Creates services for frontend, backend, database, redis

3. **Set Environment Variables**
   - Go to each service settings
   - Add variables from .env.example
   - Set production values:
     - \`APP_ENV=production\`
     - \`APP_DEBUG=false\`
     - Generate new \`APP_KEY\`: \`php artisan key:generate\`
     - Generate new \`JWT_SECRET\`

4. **Deploy**
   - Push to main branch
   - Railway automatically deploys
   - Runs migrations automatically
   - HTTPS enabled by default

5. **Access Your App**
   - Railway provides public URL
   - Example: \`https://form-builder-prod.railway.app\`

#### Render.com
**Why**: Free tier, good performance, simple deployment

1. **Create New Web Service**
   - Go to render.com
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository

2. **Configure Build**
   - Build Command: \`docker-compose build\`
   - Start Command: \`docker-compose up\`

3. **Set Environment Variables**
   - Add all variables from .env.example
   - Set production values

4. **Deploy**
   - Render automatically deploys on push
   - HTTPS enabled automatically

#### Fly.io
**Why**: Global deployment, edge computing, good free tier

1. **Install Fly CLI**
   \`\`\`bash
   curl -L https://fly.io/install.sh | sh
   \`\`\`

2. **Initialize Project**
   \`\`\`bash
   fly launch
   \`\`\`

3. **Configure fly.toml**
   - Set app name
   - Configure services
   - Set environment variables

4. **Deploy**
   \`\`\`bash
   fly deploy
   \`\`\`

#### AWS/DigitalOcean (Self-Hosted)
**Why**: Full control, scalability, suitable for production

1. **Create Server**
   - Ubuntu 22.04 LTS recommended
   - Minimum 2GB RAM, 20GB storage

2. **Install Docker**
   \`\`\`bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   \`\`\`

3. **Clone Repository**
   \`\`\`bash
   git clone <repository-url>
   cd form-builder
   \`\`\`

4. **Configure Environment**
   \`\`\`bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with production values
   \`\`\`

5. **Start Services**
   \`\`\`bash
   docker-compose up -d
   docker-compose exec backend php artisan migrate
   \`\`\`

6. **Configure SSL with Let's Encrypt**
   \`\`\`bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d your-domain.com
   \`\`\`

### SSL/HTTPS Configuration

#### Using Let's Encrypt (Free)

1. **Install Certbot**
   \`\`\`bash
   sudo apt-get install certbot python3-certbot-nginx
   \`\`\`

2. **Generate Certificate**
   \`\`\`bash
   sudo certbot certonly --standalone -d your-domain.com
   \`\`\`

3. **Update nginx.conf**
   \`\`\`nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

       # Security headers
       add_header Strict-Transport-Security "max-age=31536000" always;
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;

       # ... rest of configuration
   }

   # Redirect HTTP to HTTPS
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }
   \`\`\`

4. **Auto-Renewal**
   \`\`\`bash
   sudo systemctl enable certbot.timer
   sudo systemctl start certbot.timer
   \`\`\`

### Environment Variables for Production

\`\`\`bash
# Application
APP_NAME=FormBuilder
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=form_builder
DB_USERNAME=form_builder_user
DB_PASSWORD=secure_random_password

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_ALGORITHM=HS256
JWT_TTL=60

# CORS
CORS_ALLOWED_ORIGINS=https://your-domain.com

# Mail (optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@your-domain.com

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
\`\`\`

## Monitoring & Maintenance

### Health Checks
\`\`\`bash
# Check API health
curl https://your-domain.com/api/health

# Check database connection
docker-compose exec backend php artisan tinker
>>> DB::connection()->getPdo();
\`\`\`

### Database Backups

**Automated Backup (Daily)**
\`\`\`bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db mysqldump -u form_builder_user -pform_builder_password form_builder > $BACKUP_DIR/backup_$TIMESTAMP.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
\`\`\`

**Manual Backup**
\`\`\`bash
docker-compose exec db mysqldump -u form_builder_user -pform_builder_password form_builder > backup.sql
\`\`\`

**Restore Backup**
\`\`\`bash
docker-compose exec -T db mysql -u form_builder_user -pform_builder_password form_builder < backup.sql
\`\`\`

### Logs & Monitoring

\`\`\`bash
# View application logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f db

# View frontend logs
docker-compose logs -f frontend

# Export logs
docker-compose logs backend > backend.log
\`\`\`

### Performance Optimization

1. **Enable Caching**
   \`\`\`bash
   docker-compose exec backend php artisan config:cache
   docker-compose exec backend php artisan route:cache
   \`\`\`

2. **Database Optimization**
   \`\`\`bash
   # Add indexes
   docker-compose exec backend php artisan tinker
   >>> DB::statement('ALTER TABLE forms ADD INDEX idx_user_id (user_id)');
   \`\`\`

3. **Redis Configuration**
   - Use Redis for sessions
   - Use Redis for caching
   - Configure in .env: \`CACHE_DRIVER=redis\`

4. **CDN for Static Assets**
   - Configure Cloudflare or similar
   - Point to your domain

## Security Checklist

- [ ] Change default database password
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules (allow only 80, 443)
- [ ] Set up regular backups
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for all secrets
- [ ] Keep dependencies updated
- [ ] Enable database encryption
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting
- [ ] Enable CSRF protection
- [ ] Set security headers in Nginx
- [ ] Regular security audits

## Troubleshooting

### Database Connection Issues
\`\`\`bash
docker-compose exec backend php artisan tinker
>>> DB::connection()->getPdo();
\`\`\`

### Clear Cache
\`\`\`bash
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
\`\`\`

### Rebuild Images
\`\`\`bash
docker-compose build --no-cache
docker-compose up -d
\`\`\`

### Check Service Status
\`\`\`bash
docker-compose ps
\`\`\`

### View Detailed Logs
\`\`\`bash
docker-compose logs --tail=100 backend
\`\`\`

## Rollback Procedure

If deployment fails:

\`\`\`bash
# Stop current deployment
docker-compose down

# Restore previous database backup
docker-compose up -d db
docker-compose exec -T db mysql -u form_builder_user -pform_builder_password form_builder < backup_previous.sql

# Restart services
docker-compose up -d
\`\`\`

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Create test form
- [ ] Verify form persistence
- [ ] Test API endpoints
- [ ] Check HTTPS certificate
- [ ] Verify email notifications (if configured)
- [ ] Test database backups
- [ ] Monitor error logs
- [ ] Load test application
- [ ] Verify monitoring alerts
- [ ] Document deployment details

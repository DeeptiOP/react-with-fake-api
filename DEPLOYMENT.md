# Production Deployment Guide

## Backend Deployment

### Option 1: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_production_secret
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`

### Option 2: Railway/Render/Fly.io

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### Production Environment Variables
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_secure_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

## Frontend Deployment

### Option 1: Vercel

1. Push to GitHub
2. Connect repository on Vercel
3. Set environment variables:
   ```
   VITE_API_URL=your_production_api_url
   ```
4. Deploy automatically

### Option 2: Netlify

1. Build locally: `npm run build`
2. Deploy `dist` folder to Netlify
3. Set environment variables in dashboard

### Option 3: Traditional Hosting (AWS S3, GCP, etc.)

1. Build: `npm run build`
2. Upload `dist` folder
3. Configure CORS if needed
4. Set up CDN for caching

## Post-Deployment Checklist

### Security
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update ADMIN_EMAIL and ADMIN_PASSWORD
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Enable database authentication
- [ ] Setup firewall rules
- [ ] Enable rate limiting
- [ ] Setup request logging

### Performance
- [ ] Enable database indexing
- [ ] Setup CDN for static assets
- [ ] Configure caching headers
- [ ] Enable compression
- [ ] Monitor database performance
- [ ] Setup auto-scaling if needed

### Monitoring
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Setup APM monitoring
- [ ] Configure database backups
- [ ] Monitor API response times
- [ ] Setup uptime monitoring
- [ ] Configure alerts

### Database
- [ ] Create full backup
- [ ] Enable automatic backups
- [ ] Setup MongoDB Atlas IP whitelist
- [ ] Create database user credentials
- [ ] Enable authentication
- [ ] Setup connection pooling

## Scaling Considerations

1. **Database Optimization**
   - Add indexes to frequently queried fields
   - Setup read replicas for high traffic
   - Enable connection pooling

2. **API Optimization**
   - Implement caching (Redis)
   - Setup API rate limiting
   - Enable gzip compression
   - Optimize database queries

3. **Frontend Optimization**
   - Implement code splitting
   - Enable lazy loading
   - Compress images
   - Setup service workers

4. **Infrastructure**
   - Use load balancing
   - Setup auto-scaling
   - Use CDN for static assets
   - Monitor resource usage

## SSL/TLS Certificate

For production, ensure:
- [ ] Valid SSL certificate installed
- [ ] HTTPS enforced
- [ ] HSTS headers configured
- [ ] Certificate auto-renewal setup

## Backup Strategy

1. **Daily Backups**
   - Automated daily database backups
   - Store in separate location
   - Encryption enabled

2. **Disaster Recovery**
   - Test restore procedures
   - Document recovery steps
   - Maintain backup logs

## Monitoring & Logging

### Essential Metrics
- API response times
- Error rates
- User authentication attempts
- Database query times
- Server resource usage

### Tools Recommended
- Sentry (Error tracking)
- New Relic (APM)
- Datadog (Monitoring)
- LogRocket (User sessions)
- MongoDB Atlas (Database monitoring)

## Email Notifications

Setup alerts for:
- Failed authentication attempts
- Admin role changes
- System errors
- Backup failures
- Database issues

## API Rate Limiting

Implement rate limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Database Optimization Tips

1. Add indexes on frequently queried fields:
```javascript
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
```

2. Use pagination for large result sets
3. Implement query caching
4. Optimize aggregation pipelines
5. Monitor slow queries

## Security Headers

Add to your Express app:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

## CORS Configuration for Production

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-production-domain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Database Connection Best Practices

1. Use connection pooling
2. Set connection timeout
3. Enable automatic reconnection
4. Monitor connection health
5. Implement retry logic

## Troubleshooting Production Issues

### High Memory Usage
- Check for memory leaks
- Implement pagination
- Enable caching

### Slow API Response
- Check database indexes
- Monitor query performance
- Enable caching layer (Redis)

### Authentication Issues
- Verify JWT secret matches
- Check token expiration
- Verify CORS settings
- Check database connectivity

---

Remember: Security is an ongoing process. Regularly update dependencies, monitor logs, and perform security audits.

# WordPress JWT Authentication Integration

This document explains how the Next.js frontend authenticates users with WordPress using JWT tokens.

## Architecture Overview

```
Next.js Frontend
    ↓
API Routes (/api/auth/*)
    ↓
WordPress REST API
    ↓
WordPress Database
```

## Setup Requirements

### 1. WordPress JWT Plugin

You need to have JWT authentication enabled on your WordPress site. Install one of these:

- **JWT Authentication for WP-API** (Recommended)
  - Download: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
  - Or use WP-CLI: `wp plugin install jwt-authentication-for-wp-rest-api --activate`

- **Alternative**: WordPress 6.4+ has built-in JWT support via REST API

### 2. Environment Variables

Add these to `.env.local`:

```env
# WordPress API Credentials
NEXT_PUBLIC_WORDPRESS_URL=https://botaanidev.wpengine.com/za/
NEXT_PUBLIC_WORDPRESS_API_URL=https://botaanidev.wpengine.com/za/wp-json
WORDPRESS_API_USERNAME=botaanidev-cor
WORDPRESS_API_PASSWORD=KxW6FtG5xXiNseY

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Generate JWT Secret

Generate a strong random string for `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use OpenSSL:

```bash
openssl rand -hex 32
```

## API Endpoints

### Register User

**POST** `/api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

Response (201):
```json
{
  "message": "Registration successful",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "name": "John Doe",
    "username": "user123"
  }
}
```

### Login User

**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "name": "John Doe",
    "username": "user123"
  }
}
```

Sets HTTP-only cookie: `auth_token`

### Get Current User

**GET** `/api/auth/me`

Response (200):
```json
{
  "user": {
    "id": 123,
    "email": "user@example.com",
    "username": "user123"
  }
}
```

Response (401):
```json
{
  "error": "Not authenticated"
}
```

### Logout User

**POST** `/api/auth/logout`

Response (200):
```json
{
  "message": "Logout successful"
}
```

Clears `auth_token` cookie.

## How It Works

### Registration Flow

1. User fills registration form
2. Form submits to `/api/auth/register`
3. Next.js backend creates user in WordPress via REST API
4. WordPress returns user data
5. Next.js authenticates the new user with WordPress JWT endpoint
6. JWT token is created and stored in HTTP-only cookie
7. User is redirected to dashboard

### Login Flow

1. User fills login form
2. Form submits to `/api/auth/login`
3. Next.js backend searches for user in WordPress
4. Next.js authenticates with WordPress JWT endpoint
5. WordPress validates credentials
6. JWT token is created and stored in HTTP-only cookie
7. User is redirected to dashboard

### Authentication Flow

1. User makes request to protected route
2. Next.js checks for `auth_token` cookie
3. Token is verified using JWT secret
4. If valid, user data is extracted from token
5. If invalid, user is redirected to login

## Token Structure

The JWT token contains:

```json
{
  "user_id": 123,
  "user_email": "user@example.com",
  "user_nicename": "user123",
  "iat": 1234567890,
  "exp": 1234654290
}
```

- **iat**: Issued at timestamp
- **exp**: Expiration timestamp (7 days)

## Files Created

- `/lib/wordpress-auth.ts` - Authentication utilities
- `/app/api/auth/register/route.ts` - Registration endpoint
- `/app/api/auth/login/route.ts` - Login endpoint
- `/app/api/auth/me/route.ts` - Get current user endpoint
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/app/account/login/page.tsx` - Login form
- `/app/account/register/page.tsx` - Registration form
- `/app/account/dashboard/page.tsx` - User dashboard

## Security Considerations

### HTTP-Only Cookies

Tokens are stored in HTTP-only cookies, preventing XSS attacks from accessing them.

### HTTPS Only

In production, cookies are only sent over HTTPS. Set `NODE_ENV=production` to enable this.

### Token Expiration

Tokens expire after 7 days. Users must log in again after expiration.

### Password Requirements

- Minimum 8 characters
- Validated on both client and server

### CORS

If frontend and backend are on different domains, ensure CORS is properly configured in WordPress.

## Troubleshooting

### "JWT Authentication not enabled"

Ensure the JWT plugin is installed and activated on WordPress:

```bash
wp plugin activate jwt-authentication-for-wp-rest-api
```

### "User not found"

Check that:
- User exists in WordPress
- Email is correct
- WordPress database is accessible

### "Token verification failed"

Check that:
- `JWT_SECRET` matches between requests
- Token hasn't expired
- Token is properly formatted

### CORS Errors

Add to WordPress `.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## Next Steps

1. Install JWT plugin on WordPress
2. Update `.env.local` with correct credentials
3. Generate strong `JWT_SECRET`
4. Test registration at `/account/register`
5. Test login at `/account/login`
6. Verify dashboard at `/account/dashboard`
7. Implement protected routes using `getCurrentUser()`

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS properly
- [ ] Set up email verification
- [ ] Implement password reset
- [ ] Add rate limiting
- [ ] Monitor authentication logs
- [ ] Set up 2FA/MFA
- [ ] Regular security audits

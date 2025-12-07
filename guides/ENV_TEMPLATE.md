# Environment Variables Template

Copy this to `.env.local` and fill in your actual values.

```env
# ============================================
# WordPress WooCommerce API Configuration
# ============================================
# Your WordPress site URL with /wp-json endpoint
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json

# WooCommerce REST API Credentials
# Get these from: WooCommerce → Settings → Advanced → REST API
WORDPRESS_API_USERNAME=ck_your_consumer_key_here
WORDPRESS_API_PASSWORD=cs_your_consumer_secret_here

# ============================================
# WordPress User Authentication
# ============================================
# Your WordPress admin username
WORDPRESS_USERNAME=your_wp_admin_username

# WordPress Application Password
# Generate at: Users → Your Profile → Application Passwords
WORDPRESS_PASSWORD=your_application_password_here

# ============================================
# JWT Authentication Secret
# ============================================
# Generate a secure random string (32+ characters)
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_here_minimum_32_characters

# ============================================
# Next.js Configuration
# ============================================
# Set to 'production' when deploying
NODE_ENV=development
```

## How to Get These Values

### 1. WooCommerce API Credentials

1. Log in to your WordPress admin
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key**
4. Set:
   - Description: "Next.js Frontend"
   - User: Select an admin user
   - Permissions: Read/Write
5. Click **Generate API Key**
6. Copy the **Consumer Key** (starts with `ck_`) → `WORDPRESS_API_USERNAME`
7. Copy the **Consumer Secret** (starts with `cs_`) → `WORDPRESS_API_PASSWORD`

### 2. WordPress Application Password

1. Go to **Users → Your Profile**
2. Scroll to **Application Passwords**
3. Enter name: "Next.js Authentication"
4. Click **Add New Application Password**
5. Copy the generated password → `WORDPRESS_PASSWORD`

### 3. JWT Secret

Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output → `JWT_SECRET`

## Example (DO NOT USE THESE VALUES)

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://botaani.co.za/wp-json
WORDPRESS_API_USERNAME=ck_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
WORDPRESS_API_PASSWORD=cs_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=abcd 1234 efgh 5678 ijkl 9012
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## Security Notes

⚠️ **NEVER commit `.env.local` to Git**
⚠️ **Use strong, unique passwords**
⚠️ **Rotate credentials regularly**
⚠️ **Use HTTPS in production**
⚠️ **Keep WordPress and plugins updated**

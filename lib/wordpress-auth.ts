import axios from 'axios';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME || '';
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD || '';

export interface WordPressAuthToken {
  token: string;
  user_email: string;
  user_nicename: string;
  user_id: number;
}

export interface DecodedToken {
  user_id: number;
  user_email: string;
  user_nicename: string;
  iat: number;
  exp: number;
}

/**
 * Register a new user in WordPress
 */
export async function registerWordPressUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const basicAuth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');
    
    const response = await axios.post(
      `${WORDPRESS_API_URL}/wp/v2/users`,
      {
        username: email.split('@')[0] + Date.now(), // Unique username
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
      },
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
        },
      }
    );

    return {
      success: true,
      message: 'User registered successfully',
      user: response.data,
    };
  } catch (error: any) {
    console.error('WordPress registration error:', error.response?.data || error.message);
    console.error('Full error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Registration failed',
    };
  }
}

/**
 * Authenticate user with WordPress and get JWT token
 */
export async function authenticateWordPressUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; token?: string; user?: any }> {
  try {
    const basicAuth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');
    
    // First, get the user by email
    console.log('🔍 Searching for user with email:', email);
    const userResponse = await axios.get(
      `${WORDPRESS_API_URL}/wp/v2/users`,
      {
        params: {
          search: email,
          _fields: 'id,username,email,name,slug,first_name,last_name',
        },
        headers: {
          'Authorization': `Basic ${basicAuth}`,
        },
      }
    );

    console.log('📋 User search response:', userResponse.data);

    if (!userResponse.data || userResponse.data.length === 0) {
      console.error('❌ User not found with email:', email);
      return {
        success: false,
        message: 'Wrong email or password',
      };
    }

    const userSearchResult = userResponse.data[0];
    console.log('✅ Found user in search:', { id: userSearchResult.id, name: userSearchResult.name });

    // Fetch the full user object to get username and email
    console.log('📥 Fetching full user details for ID:', userSearchResult.id);
    const fullUserResponse = await axios.get(
      `${WORDPRESS_API_URL}/wp/v2/users/${userSearchResult.id}`,
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
        },
      }
    );

    const user = fullUserResponse.data;
    
    // WordPress REST API may not return username/email due to permissions
    // Use slug as fallback for username, and search email from the original search
    const username = user.username || user.slug;
    const userEmail = user.email || email;
    
    console.log('✅ Full user details:', { 
      id: user.id, 
      username: username,
      email: userEmail,
      name: user.name,
      slug: user.slug,
      allKeys: Object.keys(user)
    });
    console.log('📊 Full user object:', JSON.stringify(user, null, 2));

    // Verify password using WordPress JWT endpoint
    console.log('🔐 Verifying password for user:', username);
    let passwordVerified = false;
    
    try {
      const jwtResponse = await axios.post(
        `${WORDPRESS_API_URL}/jwt-auth/v1/token`,
        {
          username: username,
          password,
        }
      );

      if (jwtResponse.data.token) {
        console.log('✅ Password verified via JWT endpoint');
        passwordVerified = true;
      }
    } catch (jwtError: any) {
      console.warn('⚠️ JWT endpoint failed');
      console.error('JWT Error Status:', jwtError.response?.status);
      console.error('JWT Error Data:', jwtError.response?.data);
      console.error('JWT Error Message:', jwtError.message);
      
      // Fallback: Try to verify password using basic auth with user's credentials
      try {
        console.log('🔄 Attempting fallback: basic auth verification');
        const userBasicAuth = Buffer.from(`${user.username}:${password}`).toString('base64');
        console.log('📝 Basic auth header created for username:', user.username);
        
        const verifyResponse = await axios.get(
          `${WORDPRESS_API_URL}/wp/v2/users/me`,
          {
            headers: {
              'Authorization': `Basic ${userBasicAuth}`,
            },
          }
        );

        console.log('✅ Basic auth response received:', verifyResponse.data?.id);
        if (verifyResponse.data && verifyResponse.data.id === user.id) {
          console.log('✅ Password verified via basic auth');
          passwordVerified = true;
        }
      } catch (basicAuthError: any) {
        console.error('❌ Basic auth verification failed');
        console.error('Basic Auth Error Status:', basicAuthError.response?.status);
        console.error('Basic Auth Error Data:', basicAuthError.response?.data);
        console.error('Basic Auth Error Message:', basicAuthError.message);
      }
    }

    if (!passwordVerified) {
      return {
        success: false,
        message: 'Wrong email or password',
      };
    }

    console.log('✅ Password verified, creating auth token');

    // Use the username and email we resolved earlier
    const userSlug = user.slug || email.split('@')[0];

    // Create our own JWT token
    const token = await createJWT({
      user_id: user.id,
      user_email: userEmail,
      user_nicename: userSlug,
    });

    return {
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: userEmail,
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        username: username,
      },
    };
  } catch (error: any) {
    console.error('WordPress authentication error:', error.response?.data || error.message);
    console.error('Full error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Authentication failed',
    };
  }
}

/**
 * Create JWT token
 */
export async function createJWT(payload: Omit<DecodedToken, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyJWT(token: string): Promise<DecodedToken | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as DecodedToken;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Get current user from JWT token in cookies
 */
export async function getCurrentUser(): Promise<DecodedToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    return await verifyJWT(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Set auth token in HTTP-only cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clear auth token from cookies
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

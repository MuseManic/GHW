import { NextRequest, NextResponse } from 'next/server';
import { authenticateWordPressUser } from '@/lib/wordpress-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const authResult = await authenticateWordPressUser(email, password);

    if (!authResult.success || !authResult.token) {
      return NextResponse.json(
        { error: authResult.message || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Set auth cookie in response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: authResult.user,
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

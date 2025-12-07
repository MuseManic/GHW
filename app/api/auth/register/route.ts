import { NextRequest, NextResponse } from 'next/server';
import { registerWordPressUser, authenticateWordPressUser } from '@/lib/wordpress-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password, confirmPassword } = body;

    // Validation
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Register user in WordPress
    const registerResult = await registerWordPressUser(email, firstName, lastName, password);

    if (!registerResult.success) {
      return NextResponse.json(
        { error: registerResult.message },
        { status: 400 }
      );
    }

    // Authenticate user to get token
    const authResult = await authenticateWordPressUser(email, password);

    if (!authResult.success || !authResult.token) {
      return NextResponse.json(
        { error: 'Registration successful but authentication failed. Please login.' },
        { status: 400 }
      );
    }

    // Set auth cookie in response
    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: authResult.user,
      },
      { status: 201 }
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

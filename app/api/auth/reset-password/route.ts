import { NextRequest, NextResponse } from 'next/server';
import { resetWordPressUserPassword } from '@/lib/wordpress-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword, confirmPassword } = body;

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New passwords do not match' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    const result = await resetWordPressUserPassword(email, currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting password' },
      { status: 500 }
    );
  }
}

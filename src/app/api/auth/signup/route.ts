import { NextRequest, NextResponse } from 'next/server';
import { initRedis } from '@/lib/cardStorageKV';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const redis = await initRedis();
    if (!redis) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if user already exists
    const userKey = `user:email:${email}`;
    const existingUser = await redis.get(userKey);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = nanoid();
    const user = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Save user to Redis
    try {
      await redis.set(userKey, JSON.stringify(user));
      await redis.set(`user:id:${userId}`, JSON.stringify(user));
    } catch (redisError: any) {
      console.error('Redis save error:', redisError);
      return NextResponse.json(
        { error: 'Failed to save user to database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { 
        error: 'Failed to create account',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}


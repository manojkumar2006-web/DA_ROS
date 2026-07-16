import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { mode, name, contactNumber, password } = body;

    let userRole = 'user';
    let userId = '';

    if (mode === 'admin') {
      if (password !== 'JESUSLOVESYOU') {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
      userRole = 'admin';
      
      // Upsert admin user
      const adminUser = await User.findOneAndUpdate(
        { contactNumber: '0000000000' }, // Default admin number or use the one provided
        { name: 'Administrator', contactNumber, role: 'admin' },
        { upsert: true, new: true }
      );
      userId = adminUser._id.toString();
      
    } else {
      if (!name || !contactNumber) {
        return NextResponse.json({ error: 'Name and contact number are required' }, { status: 400 });
      }
      
      if (!/^\d{10}$/.test(contactNumber)) {
        return NextResponse.json({ error: 'Contact number must be exactly 10 digits' }, { status: 400 });
      }

      let user = await User.findOne({ contactNumber });
      
      if (!user) {
        // User doesn't exist, store them in DB
        user = await User.create({ name, contactNumber, role: 'user' });
      }
      // If user exists, there is no need to store/update them in DB, just log them in.
      
      userId = user._id.toString();
    }

    // Set an HTTP-only cookie to maintain the session
    const cookieStore = await cookies();
    cookieStore.set('auth-token', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true, role: userRole });
    
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

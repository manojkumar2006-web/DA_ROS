import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { users } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: 'No valid users provided' }, { status: 400 });
    }

    // Filter out invalid rows (missing name or invalid phone number)
    const validUsers = users.filter((u: any) => {
      const contactStr = String(u.contactNumber || '').trim();
      return u.name && contactStr && /^\d{10}$/.test(contactStr);
    });

    if (validUsers.length === 0) {
      return NextResponse.json({ error: 'No valid rows found. Ensure numbers are exactly 10 digits.' }, { status: 400 });
    }

    // Prepare bulk operations
    const bulkOps = validUsers.map((u: any) => {
      const contactStr = String(u.contactNumber).trim();
      return {
        updateOne: {
          filter: { contactNumber: contactStr },
          update: { 
            $set: { 
              name: String(u.name).trim(), 
              role: 'user' 
            } 
          },
          upsert: true
        }
      };
    });

    // Execute bulk write
    const result = await User.collection.bulkWrite(bulkOps);

    return NextResponse.json({ 
      success: true, 
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      insertedCount: result.insertedCount
    });

  } catch (error: any) {
    console.error('Error importing users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

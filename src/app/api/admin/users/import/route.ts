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

    // Filter out invalid rows (must have at least a name)
    const validUsers = users.filter((u: any) => u.name && u.name.trim() !== '');

    if (validUsers.length === 0) {
      return NextResponse.json({ error: 'No valid rows found.' }, { status: 400 });
    }

    // Prepare bulk operations
    const bulkOps = validUsers.map((u: any) => {
      const contactStr = String(u.contactNumber || 'no number').trim();
      const nameStr = String(u.name).trim();

      if (contactStr === 'no number') {
        // If no number, always insert as a new record
        return {
          insertOne: {
            document: { name: nameStr, contactNumber: 'no number', role: 'user' }
          }
        };
      } else {
        // If there's a valid number, update existing or insert new
        return {
          updateOne: {
            filter: { contactNumber: contactStr },
            update: { $set: { name: nameStr, role: 'user' } },
            upsert: true
          }
        };
      }
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

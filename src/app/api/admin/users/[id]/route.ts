import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Attendance from '@/models/Attendance';
import Event from '@/models/Event';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: userId } = await params;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all attendances for this user
    const attendances = await Attendance.find({ userId }).populate('eventId');
    
    // Extract the populated events from attendances
    // eventId is populated with the Event document, so we can map it
    const registeredEvents = attendances
      .map(att => att.eventId)
      .filter(event => event !== null); // Filter out any nulls if an event was deleted

    return NextResponse.json({ 
      user, 
      registeredEvents 
    });
    
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

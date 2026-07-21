import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import Attendance from '@/models/Attendance';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: eventId } = await params;

    // Fetch the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Fetch all users registered for this event
    const attendances = await Attendance.find({ eventId }).populate('userId');
    const registeredUsers = attendances.map(att => att.userId).filter(u => u !== null);

    return NextResponse.json({ event, registeredUsers });
  } catch (error: any) {
    console.error('Error fetching event details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: eventId } = await params;

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Clean up attendances
    await Attendance.deleteMany({ eventId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

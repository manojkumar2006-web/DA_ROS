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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: eventId } = await params;
    const body = await request.json();
    const { eventName, date, time, locationAddress, travelCost, gmapLink } = body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { eventName, date, time, locationAddress, travelCost, gmapLink },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: eventId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Upsert: create if not exists (avoids duplicate error)
    await Attendance.findOneAndUpdate(
      { eventId, userId },
      { eventId, userId },
      { upsert: true, new: true }
    );

    // Return updated registered users list
    const attendances = await Attendance.find({ eventId }).populate('userId');
    const registeredUsers = attendances.map(att => att.userId).filter(u => u !== null);

    return NextResponse.json({ registeredUsers });
  } catch (error: any) {
    console.error('Error registering user to event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Remove a single user from an event
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: eventId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    await Attendance.deleteOne({ eventId, userId });

    // Return updated list
    const attendances = await Attendance.find({ eventId }).populate('userId');
    const registeredUsers = attendances.map(att => att.userId).filter(u => u !== null);

    return NextResponse.json({ registeredUsers });
  } catch (error: any) {
    console.error('Error removing user from event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

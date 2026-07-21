import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

// GET all events
export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all events, sort by date (newest created first)
    const events = await Event.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create a new event
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { eventName, date, time, locationAddress, travelCost, gmapLink } = body;

    if (!eventName || !date || !time || !locationAddress) {
      return NextResponse.json({ error: 'Name, date, time, and location are required' }, { status: 400 });
    }

    // Create the event
    const newEvent = await Event.create({
      eventName,
      date,
      time,
      locationAddress,
      gmapLink: gmapLink || '',
      travelCost: travelCost || '0'
    });

    return NextResponse.json({ event: newEvent });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

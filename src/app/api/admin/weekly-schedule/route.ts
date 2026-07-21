import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WeeklySchedule from '@/models/WeeklySchedule';

// GET all weekly schedules
export async function GET() {
  try {
    await dbConnect();
    const schedule = await WeeklySchedule.find({});
    return NextResponse.json({ schedule });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT - upsert a single day's services
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { day, services } = await request.json();
    if (!day || !services) {
      return NextResponse.json({ error: 'Day and services are required' }, { status: 400 });
    }
    const updated = await WeeklySchedule.findOneAndUpdate(
      { day },
      { services },
      { upsert: true, new: true }
    );
    return NextResponse.json({ schedule: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

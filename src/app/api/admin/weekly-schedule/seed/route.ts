import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WeeklySchedule from '@/models/WeeklySchedule';

const WEEKLY_SCHEDULE = [
  {
    day: 'Monday',
    services: [
      'Monday Morning Service',
      'Monday Evening Service',
      'Monday Night Service',
    ],
  },
  {
    day: 'Tuesday',
    services: [
      "Women's Meeting",
      'Tuesday Morning Service',
      'Tuesday Evening Service',
      'Tuesday Night Service',
    ],
  },
  {
    day: 'Wednesday',
    services: [
      'Wednesday Morning Service',
      'Wednesday Evening Service',
      'Wednesday Night Service',
    ],
  },
  {
    day: 'Thursday',
    services: [
      'Thursday Morning Service',
      'Thursday Evening Service',
      'Thursday Night Service',
    ],
  },
  {
    day: 'Friday',
    services: [
      'Fasting Prayer',
      'Friday Morning Service',
      'Friday Evening Service',
      'Friday Night Service',
    ],
  },
  {
    day: 'Saturday',
    services: [
      'Choir Practice',
      'Saturday Morning Service',
      'Saturday Evening Service',
      'Saturday Night Service',
    ],
  },
  {
    day: 'Sunday',
    services: [
      'Sunday Service 1',
      'Sunday Service 2',
      'Youth Ministry',
      'Village Ministry',
      "Men's Fellowship",
    ],
  },
];

export async function POST() {
  try {
    await dbConnect();

    const ops = WEEKLY_SCHEDULE.map(({ day, services }) => ({
      updateOne: {
        filter: { day },
        update: { $set: { day, services } },
        upsert: true,
      },
    }));

    await WeeklySchedule.bulkWrite(ops);

    return NextResponse.json({
      message: 'Weekly schedule seeded successfully',
      days: WEEKLY_SCHEDULE.length,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import mongoose from 'mongoose';

export interface IWeeklySchedule extends mongoose.Document {
  day: string; // 'Monday', 'Tuesday', etc.
  services: string[]; // list of service names for that day
}

const WeeklyScheduleSchema = new mongoose.Schema<IWeeklySchedule>({
  day: { type: String, required: true, unique: true },
  services: [{ type: String, required: true }],
});

export default mongoose.models.WeeklySchedule ||
  mongoose.model<IWeeklySchedule>('WeeklySchedule', WeeklyScheduleSchema);

import mongoose from 'mongoose';

export interface IEvent extends mongoose.Document {
  eventName: string;
  date: string;
  time: string;
  locationAddress: string;
  gmapLink?: string;
  travelCost: string;
  createdAt: Date;
}

const EventSchema = new mongoose.Schema<IEvent>({
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  locationAddress: {
    type: String,
    required: [true, 'Please provide the physical location address for the event'],
  },
  gmapLink: {
    type: String,
    required: false,
  },
  travelCost: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  contactNumber: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  contactNumber: { type: String, default: 'no number' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

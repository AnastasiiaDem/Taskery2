export {};
import mongoose, {Schema} from 'mongoose';

interface IUser {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  sendAssignedEmail: boolean;
  sendTaskEmail: boolean;
  sendTaskOverdueEmail: boolean;
}

export const UserSchema = new Schema<IUser>({
  _id: Schema.Types.ObjectId,
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, default: 'TeamMember'},
  sendAssignedEmail: {type: Boolean, default: false},
  sendTaskEmail: {type: Boolean, default: false},
  sendTaskOverdueEmail: {type: Boolean, default: false},
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;

export {};
import mongoose, {Schema} from 'mongoose';

enum RoleEnum {
  'TeamMember' = 'TeamMember',
  'ProjectManager' = 'ProjectManager',
  'Admin' = 'Admin'
}

interface IUser {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleEnum;
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
  role: {type: String, enum: RoleEnum, default: RoleEnum.TeamMember},
  sendAssignedEmail: {type: Boolean, default: false},
  sendTaskEmail: {type: Boolean, default: false},
  sendTaskOverdueEmail: {type: Boolean, default: false},
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;

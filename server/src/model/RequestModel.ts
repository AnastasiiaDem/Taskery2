export {};
import mongoose, {Schema} from 'mongoose';

interface IRequest {
  _id: Schema.Types.ObjectId;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
}

export const RequestSchema = new Schema<IRequest>({
  _id: Schema.Types.ObjectId,
  userId: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  description: {type: String, required: true}
});

const Request = mongoose.model<IRequest>('Request', RequestSchema);
export default Request;

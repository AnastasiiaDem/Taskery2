export {};
import mongoose, { Schema } from "mongoose";

enum StatusEnum {
  'todo' = 'To Do',
  'inProgress' = 'In Progress',
  'onReview' = 'On Review',
  'done' = 'Done'
}

interface ITask {
  _id: Schema.Types.ObjectId;
  employeeId: Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;
  title: string;
  description: string;
  status: StatusEnum;
  deadline: string;
}

export const TaskSchema = new Schema<ITask>({
  _id: Schema.Types.ObjectId,
  employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, require: true },
  description: { type: String, required: true },
  status: { type: String, enum: StatusEnum, required: true },
  deadline: { type: String, require: true }
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;

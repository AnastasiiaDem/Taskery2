import { StatusEnum } from "../enums";

export class ProjectModel {
  id: number;
  userId: number;
  projectName: string;
  description: string;
  status: StatusEnum;
  assignedUsers: Array<any>;
  createdAt: string;
  updatedAt: string;
}

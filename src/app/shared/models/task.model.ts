import {StatusEnum} from '../enums';

export class TaskModel {
  id: number;
  employeeId: number;
  projectId: number;
  title: string;
  description: string;
  status: StatusEnum;
  deadline: string;
}

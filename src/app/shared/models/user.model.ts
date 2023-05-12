import { RoleEnum } from "../enums";

export class UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleEnum;
  sendAssignedEmail: boolean;
  sendTaskEmail: boolean;
  sendTaskOverdueEmail: boolean;
}

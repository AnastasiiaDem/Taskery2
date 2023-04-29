export class UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  sendAssignedEmail: boolean;
  sendTaskEmail: boolean;
  sendTaskOverdueEmail: boolean;
}

export enum Role {
  TeamMember = 'TeamMember',
  ProjectManager = 'ProjectManager',
  Admin = 'Admin'
}

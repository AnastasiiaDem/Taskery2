
export class UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export enum Role {
  TeamMember = 'TeamMember',
  ProjectManager = 'ProjectManager'
}

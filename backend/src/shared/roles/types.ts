export interface IRole {
  role_id: number;
  role_name: string;
  role_description: string;
}

export interface ICreateRole {
  roleName: string;
  roleDescription: string;
}

export interface IUsersRole {
  role_id: number;
  user_id: number;
}

export interface ICreateUsersRole {
  roleId: number;
  userId: number;
}

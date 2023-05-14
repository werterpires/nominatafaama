import { IRole } from "../../shared/container/types";

export interface ApproveUserDto {
    user_id: number;
    roles?: IRole[]
    user_approved: boolean
  
  }
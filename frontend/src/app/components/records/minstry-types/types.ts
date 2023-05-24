export interface IMinistryType {
    ministry_type_id: number;
    ministry_type_name: string;
    ministry_type_approved: boolean;
  }
  
  export interface ICreateMinistryTypeDto {
    ministry_type_name: string;
  }
  
  export interface IUpdateMinistryType {
    ministry_type_id: number;
    ministry_type_name: string;
  }
  
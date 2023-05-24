export interface IMinistryType {
    ministry_type_id: number;
    ministry_type_name: string;
    ministry_type_approved: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateMinistryType {
    ministry_type_name: string;
    ministry_type_approved: boolean;
  }
  
  export interface IUpdateMinistryType {
    ministry_type_name: string;
    ministry_type_approved: boolean;
    ministry_type_id: number;
  }
  
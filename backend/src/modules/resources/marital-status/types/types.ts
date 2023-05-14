export interface IMaritalStatus {
    marital_status_type_id: number;
    marital_status_type_name: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateMaritalStatus {
    marital_status_type_name: string;
  }
  
  export interface IUpdateMaritalStatus {
    marital_status_type_name: string;
  }
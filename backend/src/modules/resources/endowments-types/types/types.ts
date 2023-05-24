export interface IEndowmentType {
    endowment_type_id: number;
    endowment_type_name: string;
    application: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateEndowmentType {
    endowment_type_name: string;
    application: number;
  }
  
  export interface IUpdateEndowmentType {
    endowment_type_name: string;
    application: number;
    endowment_type_id: number;
  }
  
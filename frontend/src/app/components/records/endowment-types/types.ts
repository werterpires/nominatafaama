export interface IEndowmentType {
    endowment_type_id: number;
    endowment_type_name: string;
    application: number;
  }
  
  export interface ICreateEndowmentTypeDto {
    endowment_type_name: string;
    application: number;
  }
  
  export interface IUpdateEndowmentType {
    endowment_type_id: number;
    endowment_type_name: string;
    application: number;
  }
  
export interface IAcademicDegree {
    degree_id: number;
    degree_name: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateAcademicDegree {
    degree_name: string;
  }
  
  export interface IUpdateAcademicDegree {
    degree_name: string;
    degree_id: number
  }
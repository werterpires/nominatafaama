export interface IAcademicFormation {
    formation_id: number;
    course_area: string;
    institution: string;
    begin_date: Date;
    conclusion_date: Date | null;
    person_id: number;
    academic_formation_approved: boolean;
    degree_id:number
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateAcademicFormation {
    course_area: string;
    institution: string;
    begin_date: Date;
    conclusion_date: Date | null;
    person_id: number;
    degree_id:number
  }
  
  export interface IUpdateAcademicFormation {
    course_area: string;
    institution: string;
    begin_date: Date;
    conclusion_date: Date | null;
    formation_id: number;
    degree_id:number

  }
  
export interface IStAcademicFormation {
  formation_id: number;
  course_area: string;
  institution: string;
  begin_date: string;
  conclusion_date: string | null;
  person_id: number;
  academic_formation_approved: boolean;
  degree_id:number;
  degree_name:string;

}

export interface IStCreateAcademicFormation {
  course_area: string;
  institution: string;
  begin_date: string;
  conclusion_date: string | null;
  degree_id: number;
}

export interface IStUpdateAcademicFormation {

  course_area: string;
  institution: string;
  begin_date: string;
  conclusion_date: string | null;
  degree_id: number;
  formation_id: number
}
export interface IAcademicDegree {
  degree_id: number,
  degree_name: string

}

export interface ICreateAcademicDegreeDto {

  degree_name: string;
}

export interface IUpdateAcademicDegree {
  degree_name: string;
  degree_id: number
}
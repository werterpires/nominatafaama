export interface ISpAcademicFormation {
  formation_id: number
  course_area: string
  institution: string
  begin_date: string
  conclusion_date: string | null
  person_id: number
  academic_formation_approved: boolean
  degree_id: number
  degree_name: string
  created_at: string
  updated_at: string
}

export interface ISpCreateAcademicFormation {
  course_area: string
  institution: string
  begin_date: string
  conclusion_date: string | null
  degree_id: number
}

export interface ISpUpdateAcademicFormation {
  course_area: string
  institution: string
  begin_date: string
  conclusion_date: string | null
  degree_id: number
  formation_id: number
}

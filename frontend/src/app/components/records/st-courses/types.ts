export interface ICourse {
  course_id: number
  course_area: string
  institution: string
  begin_date: string
  conclusion_date: string | null
  person_id: number
  course_approved: boolean | null
  created_at: string
  updated_at: string
}

export interface ICreateCourse {
  course_area: string
  institution: string
  begin_date: string
  conclusion_date: string | null
}

export interface IUpdateCourse {
  course_id: number
  course_area: string
  institution: string
  begin_date: string
  conclusion_date: string | null
  person_id: number
}

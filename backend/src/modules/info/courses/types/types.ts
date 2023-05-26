export interface ICourse {
  course_id: number
  course_area: string
  institution: string
  begin_date: Date
  conclusion_date: Date | null
  person_id: number
  course_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface ICreateCourse {
  course_area: string
  institution: string
  begin_date: Date
  conclusion_date: Date | null
  person_id: number
  course_approved: boolean | null
}

export interface IUpdateCourse {
  course_id: number
  course_area: string
  institution: string
  begin_date: Date
  conclusion_date: Date | null
  person_id: number
  course_approved: boolean | null
}

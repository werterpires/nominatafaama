export interface IPreviousMarriage {
  previous_marriage_id: number
  marriage_end_date: Date
  student_id: number
  previous_marriage_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface ICreatePreviousMarriage {
  marriage_end_date: Date
  previous_marriage_approved: boolean | null
  student_id: number
}

export interface IUpdatePreviousMarriage {
  previous_marriage_id: number
  marriage_end_date: Date
  student_id: number
  previous_marriage_approved: boolean | null
}

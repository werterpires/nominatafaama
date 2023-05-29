export interface IPreviousMarriage {
  previous_marriage_id: number
  marriage_end_date: string
  student_id: number
  previous_marriage_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface CreatePreviousMarriageDto {
  marriage_end_date: string
}

export interface UpdatePreviousMarriageDto {
  previous_marriage_id: number
  marriage_end_date: string
  student_id: number
}

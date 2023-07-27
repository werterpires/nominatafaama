export interface IProfessor {
  professor_id: number
  person_id: number
  person_name: string
  assignments: string
  professor_photo_address: string
  approved: boolean | null
  created_at: string
  updated_at: string
}

export interface ICreateProfessorAssignment {
  assignments: string
}

export interface IUpdateProfessorAssignment {
  assignments: string
  professor_id: number
}

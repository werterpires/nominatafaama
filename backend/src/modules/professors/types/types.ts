export interface IProfessor {
  professor_id: number
  person_id: number
  assignments: string
  professor_photo_address: string
  approved: boolean | null
  created_at: string
  updated_at: string
}

export interface ICreateProfessorAssgnment {
  person_id: number
  assignments: string
  approved: boolean | null
}

export interface IUpdateProfessor {
  professor_id: number
  assignments?: string
  professor_photo_address?: string
  approved: boolean | null
}

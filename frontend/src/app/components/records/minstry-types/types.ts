export interface IMinistryType {
  ministry_type_id: number
  ministry_type_name: string
  ministry_type_approved: boolean
  created_at: string
  updated_at: string
}

export interface ICreateMinistryTypeDto {
  ministry_type_name: string
}

export interface IUpdateMinistryType {
  ministry_type_id: number
  ministry_type_name: string
}

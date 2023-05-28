export interface IRelatedMinistry {
  related_ministry_id: number
  person_id: number
  ministry_type_id: number
  priority: number
  related_ministry_approved: boolean | null
  ministry_type_name: string
  created_at: Date
  updated_at: Date
}

export interface ICreateRelatedMinistry {
  person_id: number
  ministry_type_id: number
  priority: number
  related_ministry_approved: boolean | null
}

export interface IUpdateRelatedMinistry {
  related_ministry_id: number
  person_id: number
  ministry_type_id: number
  priority: number
  related_ministry_approved: boolean | null
}

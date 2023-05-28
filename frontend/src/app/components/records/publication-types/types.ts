export interface IPublicationType {
  publication_type_id: number
  publication_type: string
  instructions: string
  created_at: string
  updated_at: string
}

export interface CreatePublicationTypeDto {
  publication_type: string
  instructions: string
}

export interface UpdatePublicationTypeDto {
  publication_type: string
  instructions: string
  publication_type_id: number
}

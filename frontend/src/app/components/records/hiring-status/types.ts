export interface IHiringStatus {
  hiring_status_id: number
  hiring_status_name: string
  hiring_status_description: string
  created_at: string
  updated_at: string
}

export interface CreateHiringStatusDto {
  hiring_status_name: string
  hiring_status_description: string
}

export interface UpdateHiringStatusDto {
  hiring_status_name: string
  hiring_status_description: string
  hiring_status_id: number
}

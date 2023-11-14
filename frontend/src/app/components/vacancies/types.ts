export interface CreateVacancyDto {
  ministryId: number

  title: string

  description: string

  hiringStatusId: number

  nominataId: number
}

export interface UpdateVacancyDto {
  vacancyId: number
  ministryId: number
  title: string
  description: string
  hiringStatusId: number
}

export interface ISinteticProfessor {
  name: string
  professor_id: number
  person_id: number
  cpf: string
  nominata_id: number[] | null
}

export interface CreateNominataProfessors {
  nominata_id: number
  professor_id: number[]
}

// export interface UpdateAssociationDto {
//   association_id: number
//   association_name: string
//   association_acronym: string
//   union_id: number
// }

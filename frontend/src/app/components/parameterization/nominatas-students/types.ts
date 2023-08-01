// export interface IAssociation {
//   association_id: number
//   association_name: string
//   association_acronym: string
//   union_id: number
//   union_name: string
//   union_acronym: string
//   created_at: string
//   updated_at: string
// }

export interface ISinteticStudent {
  name: string
  student_id: number
  person_id: number
  cpf: string
  nominata_id: number[] | null
}

export interface CreateNominataStudents {
  nominata_id: number
  student_id: number[]
}

// export interface UpdateAssociationDto {
//   association_id: number
//   association_name: string
//   association_acronym: string
//   union_id: number
// }

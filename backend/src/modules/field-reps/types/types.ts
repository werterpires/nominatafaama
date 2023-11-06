export interface IFieldRep {
  repId: number
  personId: number
  personName: string
  phoneNumber: string
}

export interface ICreateFieldRep {
  personId: number
  phoneNumber: string
}

export interface IUpdateFieldRep {
  repId: number
  phoneNumber: string
}

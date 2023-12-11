export interface IFieldRep {
  repId: number
  personId: number
  personName: string
  phoneNumber: string
}

export interface ICreateFieldRep {
  phoneNumber: string
}

export interface IUpdateFieldRep {
  phoneNumber: string
  repId: number
}

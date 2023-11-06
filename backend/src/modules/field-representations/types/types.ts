import { IFieldRep } from 'src/modules/field-reps/types/types'

export interface IFieldRepresentation {
  representationId: number
  rep: IFieldRep
  representedField: string
  representedFieldId: number
  functionn: string
  repApproved: boolean
  repActiveValidate: Date
}

export interface ICreateFieldRepresentation {
  repId: number
  representedFieldId: number
  functionn: string
  repApproved: boolean
  repActiveValidate: Date
}

export interface IUpdateFieldRepresentation {
  representationId: number
  representedFieldId: number
  functionn: string
  repApproved: boolean
  repActiveValidate: Date
}

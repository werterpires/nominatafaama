import { IFieldRep } from 'src/modules/field-reps/types/types'

export interface IFieldRepresentation {
  representationId: number
  rep: IFieldRep
  representedField: string
  representedFieldId: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: Date
}

export interface ICreateFieldRepresentation {
  repId: number
  representedFieldId: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: Date
}

export interface IUpdateFieldRepresentation {
  representationId: number
  representedFieldId: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: Date
}

export interface IEvaluateFieldRepresentation {
  representationId: number
  repApproved: boolean
  repActiveValidate: Date
}

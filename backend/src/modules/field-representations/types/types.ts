import { IFieldRep } from 'src/modules/field-reps/types/types'

export interface IFieldRepresentation {
  representationID: number
  rep: IFieldRep
  representedField: string
  representedFieldID: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: Date
}

export interface ICreateFieldRepresentation {
  repID: number
  representedFieldID: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: Date
}

export interface IUpdateFieldRepresentation {
  representationID: number
  representedFieldID: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: Date
}

export interface IEvaluateFieldRepresentation {
  representationID: number
  repApproved: boolean
  repActiveValidate: Date
}

import { IFieldRep } from '../field-reps/types'

export interface IFieldRepresentation {
  representationID: number
  rep: IFieldRep
  representedField: string
  representedFieldID: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: string
}

export interface CreateFieldRepresentationDto {
  representedFieldID: number
  functionn: string
}

export interface UpdateFieldRepresentationDto
  extends CreateFieldRepresentationDto {
  representationID: number
}

export interface EvaluateFieldRepresentationDto {
  representationID: number
  repApproved: boolean
  repActiveValidate: string
}

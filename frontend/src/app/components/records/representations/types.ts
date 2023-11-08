import { IFieldRep } from '../field-reps/types'

export interface IFieldRepresentation {
  representationId: number
  rep: IFieldRep
  representedField: string
  representedFieldId: number
  functionn: string
  repApproved: boolean | null
  repActiveValidate: string
}

export interface CreateFieldRepresentationDto {
  representedFieldId: number
  functionn: string
}

export interface UpdateFieldRepresentationDto
  extends CreateFieldRepresentationDto {
  representationId: number
}

export interface EvaluateFieldRepresentationDto {
  representationId: number
  repApproved: boolean
  repActiveValidate: string
}

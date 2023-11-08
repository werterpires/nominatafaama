import { PartialType } from '@nestjs/mapped-types'
import { CreateFieldRepresentationDto } from './create-field-representation.dto'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class UpdateFieldRepresentationDto extends CreateFieldRepresentationDto {
  @IsNumber()
  representationID: number
}

export class EvaluateFieldRepresentationDto {
  @IsNumber()
  representationID: number
  @IsBoolean()
  repApproved: boolean
  @IsString()
  repActiveValidate: string
}

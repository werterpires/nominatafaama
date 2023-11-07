import { PartialType } from '@nestjs/mapped-types'
import { CreateFieldRepresentationDto } from './create-field-representation.dto'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class UpdateFieldRepresentationDto extends CreateFieldRepresentationDto {
  @IsNumber()
  representationId: number
}

export class EvaluateFieldRepresentationDto {
  @IsNumber()
  representationId: number
  @IsBoolean()
  repApproved: boolean
  @IsString()
  repActiveValidate: string
}

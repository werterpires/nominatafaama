import { PartialType } from '@nestjs/mapped-types'
import { CreateFieldRepDto } from './create-field-rep.dto'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdateFieldRepDto extends PartialType(CreateFieldRepDto) {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string

  @IsNumber()
  rep_id: number
}

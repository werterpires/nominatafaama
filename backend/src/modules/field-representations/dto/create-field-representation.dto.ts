import { IsNumber, IsString } from 'class-validator'

export class CreateFieldRepresentationDto {
  @IsNumber()
  representedFieldId: number

  @IsString()
  functionn: string
}

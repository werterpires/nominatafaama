import { IsNumber, IsString } from 'class-validator'

export class CreateFieldRepresentationDto {
  @IsNumber()
  representedFieldID: number

  @IsString()
  functionn: string
}

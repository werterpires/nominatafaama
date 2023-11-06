import { IsNotEmpty, IsString, Length } from 'class-validator'
export class CreateFieldRepDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string
}

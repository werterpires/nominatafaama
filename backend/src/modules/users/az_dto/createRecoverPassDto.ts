import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  isNotEmpty,
} from 'class-validator'

export class CreateRecoverPassDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  principalEmail: string
}

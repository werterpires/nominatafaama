import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  isNotEmpty,
} from 'class-validator'

export class CompareRecoverPassDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  principalEmail: string

  @IsNotEmpty()
  @IsString()
  passCode: string
}

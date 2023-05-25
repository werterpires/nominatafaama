import {IsNotEmpty, IsInt, Min, IsBoolean} from 'class-validator'

export class CreateLanguageDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  chosen_language: number

  @IsNotEmpty()
  @IsBoolean()
  read: boolean

  @IsNotEmpty()
  @IsBoolean()
  understand: boolean

  @IsNotEmpty()
  @IsBoolean()
  speak: boolean

  @IsNotEmpty()
  @IsBoolean()
  write: boolean

  @IsNotEmpty()
  @IsBoolean()
  fluent: boolean

  @IsNotEmpty()
  @IsBoolean()
  unknown: boolean
}

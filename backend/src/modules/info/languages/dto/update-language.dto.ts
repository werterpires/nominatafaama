import {IsNotEmpty, IsInt, IsBoolean, Min} from 'class-validator'

export class UpdateLanguageDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  language_id

  @IsNotEmpty()
  @IsInt()
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

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id
}

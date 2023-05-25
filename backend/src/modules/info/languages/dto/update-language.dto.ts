import { IsNotEmpty, IsInt, IsBoolean } from "class-validator";

export class UpdateLanguageDto {
  @IsNotEmpty()
  @IsInt()
  chosen_language: number;

  @IsNotEmpty()
  @IsBoolean()
  read: boolean;

  @IsNotEmpty()
  @IsBoolean()
  understand: boolean;

  @IsNotEmpty()
  @IsBoolean()
  speak: boolean;

  @IsNotEmpty()
  @IsBoolean()
  write: boolean;

  @IsNotEmpty()
  @IsBoolean()
  fluent: boolean;

  @IsNotEmpty()
  @IsBoolean()
  unknown: boolean;

  @IsNotEmpty()
  @IsBoolean()
  language_approved: boolean;
}

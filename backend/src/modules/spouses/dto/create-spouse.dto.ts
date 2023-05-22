import { IsNotEmpty, IsString, Length, IsNumber, IsBoolean, IsDate, MinLength, ValidateIf, IsOptional } from 'class-validator';

export class CreateSpouseDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  phone_number: string;

  @IsNotEmpty()
  @IsBoolean()
  is_whatsapp: boolean;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  alternative_email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  birth_city: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  birth_state: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  primary_school_state: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  primary_school_city: string;

  @IsNotEmpty()
  birth_date: string;

  @IsNotEmpty()
  baptism_date: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  baptism_place: string;

  @IsNotEmpty()
  @IsNumber()
  origin_field_id: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 400)
  justification: string;

  @IsOptional()
  civil_marriage_date: string | null;

  @IsOptional()
  @IsString()
  civil_marriage_city: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  civil_marriage_state: string;

  @IsOptional()
  @IsString()
  registry: string | null;

  @IsOptional()
  @IsString()
  registry_number: string | null;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Length(11)
  cpf: string;
}

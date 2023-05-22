import { IsNotEmpty, IsString, Length, IsNumber, IsBoolean, IsDate, MinLength, IsOptional } from 'class-validator';

export class UpdateSpouseDto {
  @IsNotEmpty()
  @IsNumber()
  spouse_id: number;

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
  @Length(1, 400)
  justification: string;

  @IsNotEmpty()
  @IsNumber()
  person_id: number;

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
  @IsString()
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  baptism_date: Date;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  baptism_place: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  civil_marriage_state: string;

  @IsOptional()
  @IsString()
  civil_marriage_date: Date | null;

  @IsString()
  civil_marriage_city: string | null;

  @IsString()
  registry: string | null;

  @IsString()
  registry_number: string | null;

  @IsNotEmpty()
  @IsBoolean()
  spouse_approved: boolean;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  origin_field_id: number;
}

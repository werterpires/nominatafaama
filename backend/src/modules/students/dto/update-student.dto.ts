import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator'

export class UpdateStudentDto {
  @IsNotEmpty()
  @IsNumber()
  student_id: number

  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  phone_number: string

  @IsNotEmpty()
  @IsBoolean()
  is_whatsapp: boolean

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  alternative_email: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  student_mensage: string

  @IsNotEmpty()
  @IsNumber()
  person_id: number

  @IsNotEmpty()
  @IsNumber()
  origin_field_id: number

  @IsNotEmpty()
  @IsString()
  @Length(1, 400)
  justification: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  birth_city: string

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  birth_state: string

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  primary_school_state: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  primary_school_city: string

  @IsNotEmpty()
  birth_date: string

  @IsNotEmpty()
  baptism_date: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  baptism_place: string

  @IsNotEmpty()
  @IsNumber()
  marital_status_id: number
}

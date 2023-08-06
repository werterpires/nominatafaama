import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator'

export class UpdateNominataProfessorsDto {
  @IsNumber()
  nominata_id: number

  @IsArray()
  professor_id: number[]
}

import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator'

export class UpdateNominataStudentsDto {
  @IsNumber()
  nominata_id: number

  @IsArray()
  student_id: number[]
}

import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class UpdatePreviousMarriageDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  previous_marriage_id: number

  @IsNotEmpty()
  @IsDateString()
  marriage_end_date: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  student_id: number
}

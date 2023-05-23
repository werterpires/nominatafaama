import { IsOptional, IsString, Length, IsDateString, IsInt, Min, IsBoolean } from "class-validator";

export class UpdateAcademicFormationDto {
    @IsString()
    @Length(1, 250)
    course_area: string;
  
    @IsString()
    @Length(1, 250)
    institution: string;
  
    @IsDateString()
    begin_date: string;
  
    @IsOptional()
    @IsDateString()
    conclusion_date: string | null;
  
    @IsInt()
    @Min(1)
    degree_id: number;

    @IsInt()
    @Min(1)
    formation_id: number
  }
  
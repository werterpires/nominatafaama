import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateAcademicDegreeDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  degree_name: string;
  
  @IsNotEmpty()
  @IsNumber()
  degree_id:number
}
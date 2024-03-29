import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateMaritalStatusDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  marital_status_type_name: string;
  
  @IsNotEmpty()
  @IsNumber()
  marital_status_type_id:number
}
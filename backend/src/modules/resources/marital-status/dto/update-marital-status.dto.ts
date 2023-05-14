import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateMaritalStatusDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  marital_status_type_name: string;
}
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateHiringStatusDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  hiring_status_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  hiring_status_description: string;

  @IsNotEmpty()
  @IsNumber()
  hiring_status_id: number;
}
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateUnionDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  union_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  union_acronym: string;

  @IsNotEmpty()
  @IsNumber()
  union_id: number;
}
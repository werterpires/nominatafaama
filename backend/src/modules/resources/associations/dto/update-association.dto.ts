import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateAssociationDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  association_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  association_acronym: string;

  @IsNotEmpty()
  @IsNumber()
  association_id: number;

  @IsNotEmpty()
  @IsNumber()
  union_id: number;
}
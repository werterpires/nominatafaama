import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class CreateAssociationDto {
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
  union_id: number;
}
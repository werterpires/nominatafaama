import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUnionDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  union_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  union_acronym: string;
}

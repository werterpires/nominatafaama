import {
  IsString,
  Length,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsNotEmpty,
  IsUrl,
} from 'class-validator'

export class UpdatePublicationDto {
  @IsInt()
  @Min(1)
  publication_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  publication_type_id: number

  @IsString()
  @Length(1, 500)
  @IsOptional()
  reference: string

  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  link: string | null

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}

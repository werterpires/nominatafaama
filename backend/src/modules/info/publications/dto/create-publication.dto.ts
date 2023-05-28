import {
  IsNotEmpty,
  IsString,
  Length,
  IsInt,
  Min,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator'

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  publication_type_id: number

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  reference: string

  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  link: string | null
}

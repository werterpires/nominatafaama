import { IsNotEmpty, IsInt, Min, IsString } from 'class-validator'

export class UpdateStudentPhotoDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  photo_pack_id: number

  @IsNotEmpty()
  @IsString()
  alone_photo: string

  @IsNotEmpty()
  @IsString()
  family_photo: string

  @IsNotEmpty()
  @IsString()
  other_family_photo: string

  @IsNotEmpty()
  @IsString()
  spouse_photo: string

  @IsNotEmpty()
  @IsString()
  invite_photo: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  student_id: number
}

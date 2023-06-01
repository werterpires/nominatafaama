import { IsNotEmpty, IsString } from 'class-validator'

export class CreateStudentPhotoDto {
  @IsNotEmpty()
  alone_photo: string

  @IsNotEmpty()
  family_photo: string

  @IsNotEmpty()
  other_family_photo: string

  @IsNotEmpty()
  spouse_photo: string

  @IsNotEmpty()
  invite_photo: string
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateStudentPhotoDto {
  @IsNotEmpty()
  file: Express.Multer.File
}

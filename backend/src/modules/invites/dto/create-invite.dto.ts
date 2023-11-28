import { IsNumber, IsString } from 'class-validator'

export class CreateInviteDto {
  @IsNumber()
  vacancyStudentId: number

  @IsNumber()
  vacancyId: number

  @IsNumber()
  studentId: number

  @IsString()
  deadline: string

  @IsString()
  voteNumber: string

  @IsString()
  voteDate: string
}

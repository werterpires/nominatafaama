import { PartialType } from '@nestjs/mapped-types'
import { CreateInviteDto } from './create-invite.dto'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class UpdateInviteDto extends PartialType(CreateInviteDto) {}

export class EvaluateInvite {
  @IsNumber()
  vacancyStudentId: number

  @IsNumber()
  vacancyId: number

  @IsNumber()
  studentId: number

  @IsString()
  deadline: string

  @IsNumber()
  inviteId: number

  @IsBoolean()
  approved: boolean
}

export class AcceptInviteDto {
  @IsNumber()
  vacancyStudentId: number

  @IsNumber()
  vacancyId: number

  @IsNumber()
  studentId: number

  @IsString()
  deadline: string

  @IsNumber()
  inviteId: number

  @IsBoolean()
  accept: boolean
}

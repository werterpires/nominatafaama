import { IsNumber, IsString } from 'class-validator'

export class UpdateOtherInvitesTimeDto {
  @IsNumber()
  otherInvitesTimeId: number

  @IsString()
  invitesBegin: string
}

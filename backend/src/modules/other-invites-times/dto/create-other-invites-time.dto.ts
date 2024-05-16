import { IsNumber, IsString } from 'class-validator'

export class CreateOtherInvitesTimeDto {
  @IsNumber()
  nominataId: number

  @IsNumber()
  fieldId: number

  @IsString()
  invitesBegin: string
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateOtherInvitesTimeDto } from './create-other-invites-time.dto';

export class UpdateOtherInvitesTimeDto extends PartialType(CreateOtherInvitesTimeDto) {}

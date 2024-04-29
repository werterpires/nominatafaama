import { Injectable } from '@nestjs/common';
import { CreateOtherInvitesTimeDto } from './dto/create-other-invites-time.dto';
import { UpdateOtherInvitesTimeDto } from './dto/update-other-invites-time.dto';

@Injectable()
export class OtherInvitesTimesService {
  create(createOtherInvitesTimeDto: CreateOtherInvitesTimeDto) {
    return 'This action adds a new otherInvitesTime';
  }

  findAll() {
    return `This action returns all otherInvitesTimes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otherInvitesTime`;
  }

  update(id: number, updateOtherInvitesTimeDto: UpdateOtherInvitesTimeDto) {
    return `This action updates a #${id} otherInvitesTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} otherInvitesTime`;
  }
}

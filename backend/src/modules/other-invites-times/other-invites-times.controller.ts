import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtherInvitesTimesService } from './other-invites-times.service';
import { CreateOtherInvitesTimeDto } from './dto/create-other-invites-time.dto';
import { UpdateOtherInvitesTimeDto } from './dto/update-other-invites-time.dto';

@Controller('other-invites-times')
export class OtherInvitesTimesController {
  constructor(private readonly otherInvitesTimesService: OtherInvitesTimesService) {}

  @Post()
  create(@Body() createOtherInvitesTimeDto: CreateOtherInvitesTimeDto) {
    return this.otherInvitesTimesService.create(createOtherInvitesTimeDto);
  }

  @Get()
  findAll() {
    return this.otherInvitesTimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherInvitesTimesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOtherInvitesTimeDto: UpdateOtherInvitesTimeDto) {
    return this.otherInvitesTimesService.update(+id, updateOtherInvitesTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otherInvitesTimesService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HiringStatusService } from './hiring-status.service';
import { CreateHiringStatusDto } from './dto/create-hiring-status.dto';
import { UpdateHiringStatusDto } from './dto/update-hiring-status.dto';

@Controller('hiring-status')
export class HiringStatusController {
  constructor(private readonly hiringStatusService: HiringStatusService) {}

  @Post()
  create(@Body() createHiringStatusDto: CreateHiringStatusDto) {
    return this.hiringStatusService.create(createHiringStatusDto);
  }

  @Get()
  findAll() {
    return this.hiringStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hiringStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHiringStatusDto: UpdateHiringStatusDto) {
    return this.hiringStatusService.update(+id, updateHiringStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hiringStatusService.remove(+id);
  }
}

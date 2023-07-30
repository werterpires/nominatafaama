import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NominatasService } from './nominatas.service';
import { CreateNominataDto } from './dto/create-nominata.dto';
import { UpdateNominataDto } from './dto/update-nominata.dto';

@Controller('nominatas')
export class NominatasController {
  constructor(private readonly nominatasService: NominatasService) {}

  @Post()
  create(@Body() createNominataDto: CreateNominataDto) {
    return this.nominatasService.create(createNominataDto);
  }

  @Get()
  findAll() {
    return this.nominatasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nominatasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNominataDto: UpdateNominataDto) {
    return this.nominatasService.update(+id, updateNominataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nominatasService.remove(+id);
  }
}

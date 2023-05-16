import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnionsService } from './unions.service';
import { CreateUnionDto } from './dto/create-union.dto';
import { UpdateUnionDto } from './dto/update-union.dto';

@Controller('unions')
export class UnionsController {
  constructor(private readonly unionsService: UnionsService) {}

  @Post()
  create(@Body() createUnionDto: CreateUnionDto) {
    return this.unionsService.create(createUnionDto);
  }

  @Get()
  findAll() {
    return this.unionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnionDto: UpdateUnionDto) {
    return this.unionsService.update(+id, updateUnionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unionsService.remove(+id);
  }
}

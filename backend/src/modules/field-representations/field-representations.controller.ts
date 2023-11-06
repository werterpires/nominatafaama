import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FieldRepresentationsService } from './field-representations.service';
import { CreateFieldRepresentationDto } from './dto/create-field-representation.dto';
import { UpdateFieldRepresentationDto } from './dto/update-field-representation.dto';

@Controller('field-representations')
export class FieldRepresentationsController {
  constructor(private readonly fieldRepresentationsService: FieldRepresentationsService) {}

  @Post()
  create(@Body() createFieldRepresentationDto: CreateFieldRepresentationDto) {
    return this.fieldRepresentationsService.create(createFieldRepresentationDto);
  }

  @Get()
  findAll() {
    return this.fieldRepresentationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldRepresentationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldRepresentationDto: UpdateFieldRepresentationDto) {
    return this.fieldRepresentationsService.update(+id, updateFieldRepresentationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldRepresentationsService.remove(+id);
  }
}

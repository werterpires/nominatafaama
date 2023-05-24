import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicationTypesService } from './services/publication-types.service';

@Controller('publication-types')
export class PublicationTypesController {
  constructor(private readonly publicationTypesService: PublicationTypesService) {}

  // @Post()
  // create(@Body() createPublicationTypeDto: CreatePublicationTypeDto) {
  //   return this.publicationTypesService.create(createPublicationTypeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.publicationTypesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.publicationTypesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePublicationTypeDto: UpdatePublicationTypeDto) {
  //   return this.publicationTypesService.update(+id, updatePublicationTypeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.publicationTypesService.remove(+id);
  // }
}

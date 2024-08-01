import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NominataPhotosService } from './nominata-photos.service';
import { CreateNominataPhotoDto } from './dto/create-nominata-photo.dto';
import { UpdateNominataPhotoDto } from './dto/update-nominata-photo.dto';

@Controller('nominata-photos')
export class NominataPhotosController {
  constructor(private readonly nominataPhotosService: NominataPhotosService) {}

  @Post()
  create(@Body() createNominataPhotoDto: CreateNominataPhotoDto) {
    return this.nominataPhotosService.create(createNominataPhotoDto);
  }

  @Get()
  findAll() {
    return this.nominataPhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nominataPhotosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNominataPhotoDto: UpdateNominataPhotoDto) {
    return this.nominataPhotosService.update(+id, updateNominataPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nominataPhotosService.remove(+id);
  }
}

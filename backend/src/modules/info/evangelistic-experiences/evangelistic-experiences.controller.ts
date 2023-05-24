import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvangelisticExperiencesService } from './evangelistic-experiences.service';
import { CreateEvangelisticExperienceDto } from './dto/create-evangelistic-experience.dto';
import { UpdateEvangelisticExperienceDto } from './dto/update-evangelistic-experience.dto';

@Controller('evangelistic-experiences')
export class EvangelisticExperiencesController {
  constructor(private readonly evangelisticExperiencesService: EvangelisticExperiencesService) {}

  @Post()
  create(@Body() createEvangelisticExperienceDto: CreateEvangelisticExperienceDto) {
    return this.evangelisticExperiencesService.create(createEvangelisticExperienceDto);
  }

  @Get()
  findAll() {
    return this.evangelisticExperiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evangelisticExperiencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvangelisticExperienceDto: UpdateEvangelisticExperienceDto) {
    return this.evangelisticExperiencesService.update(+id, updateEvangelisticExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evangelisticExperiencesService.remove(+id);
  }
}

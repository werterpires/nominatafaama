import { Injectable } from '@nestjs/common';
import { CreateEvangelisticExperienceDto } from './dto/create-evangelistic-experience.dto';
import { UpdateEvangelisticExperienceDto } from './dto/update-evangelistic-experience.dto';

@Injectable()
export class EvangelisticExperiencesService {
  create(createEvangelisticExperienceDto: CreateEvangelisticExperienceDto) {
    return 'This action adds a new evangelisticExperience';
  }

  findAll() {
    return `This action returns all evangelisticExperiences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evangelisticExperience`;
  }

  update(id: number, updateEvangelisticExperienceDto: UpdateEvangelisticExperienceDto) {
    return `This action updates a #${id} evangelisticExperience`;
  }

  remove(id: number) {
    return `This action removes a #${id} evangelisticExperience`;
  }
}

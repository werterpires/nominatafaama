import { Module } from '@nestjs/common';
import { EvangelisticExperiencesService } from './evangelistic-experiences.service';
import { EvangelisticExperiencesController } from './evangelistic-experiences.controller';

@Module({
  controllers: [EvangelisticExperiencesController],
  providers: [EvangelisticExperiencesService]
})
export class EvangelisticExperiencesModule {}

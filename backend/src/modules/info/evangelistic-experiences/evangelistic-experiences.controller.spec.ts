import { Test, TestingModule } from '@nestjs/testing';
import { EvangelisticExperiencesController } from './evangelistic-experiences.controller';
import { EvangelisticExperiencesService } from './evangelistic-experiences.service';

describe('EvangelisticExperiencesController', () => {
  let controller: EvangelisticExperiencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvangelisticExperiencesController],
      providers: [EvangelisticExperiencesService],
    }).compile();

    controller = module.get<EvangelisticExperiencesController>(EvangelisticExperiencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EvangelisticExperiencesService } from './evangelistic-experiences.service';

describe('EvangelisticExperiencesService', () => {
  let service: EvangelisticExperiencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvangelisticExperiencesService],
    }).compile();

    service = module.get<EvangelisticExperiencesService>(EvangelisticExperiencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

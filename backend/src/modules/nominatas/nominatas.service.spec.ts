import { Test, TestingModule } from '@nestjs/testing';
import { NominatasService } from './nominatas.service';

describe('NominatasService', () => {
  let service: NominatasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NominatasService],
    }).compile();

    service = module.get<NominatasService>(NominatasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

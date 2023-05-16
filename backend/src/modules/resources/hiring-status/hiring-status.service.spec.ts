import { Test, TestingModule } from '@nestjs/testing';
import { HiringStatusService } from './hiring-status.service';

describe('HiringStatusService', () => {
  let service: HiringStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiringStatusService],
    }).compile();

    service = module.get<HiringStatusService>(HiringStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

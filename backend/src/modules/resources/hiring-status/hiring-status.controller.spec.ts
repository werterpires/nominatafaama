import { Test, TestingModule } from '@nestjs/testing';
import { HiringStatusController } from './hiring-status.controller';
import { HiringStatusService } from './hiring-status.service';

describe('HiringStatusController', () => {
  let controller: HiringStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiringStatusController],
      providers: [HiringStatusService],
    }).compile();

    controller = module.get<HiringStatusController>(HiringStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NominatasController } from './nominatas.controller';
import { NominatasService } from './nominatas.service';

describe('NominatasController', () => {
  let controller: NominatasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NominatasController],
      providers: [NominatasService],
    }).compile();

    controller = module.get<NominatasController>(NominatasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

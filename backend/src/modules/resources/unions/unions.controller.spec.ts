import { Test, TestingModule } from '@nestjs/testing';
import { UnionsController } from './unions.controller';
import { UnionsService } from './unions.service';

describe('UnionsController', () => {
  let controller: UnionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnionsController],
      providers: [UnionsService],
    }).compile();

    controller = module.get<UnionsController>(UnionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

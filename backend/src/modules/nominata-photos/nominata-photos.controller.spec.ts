import { Test, TestingModule } from '@nestjs/testing';
import { NominataPhotosController } from './nominata-photos.controller';
import { NominataPhotosService } from './nominata-photos.service';

describe('NominataPhotosController', () => {
  let controller: NominataPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NominataPhotosController],
      providers: [NominataPhotosService],
    }).compile();

    controller = module.get<NominataPhotosController>(NominataPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

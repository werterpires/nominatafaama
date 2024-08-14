import { Test, TestingModule } from '@nestjs/testing';
import { NominataPhotosService } from './nominata-photos.service';

describe('NominataPhotosService', () => {
  let service: NominataPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NominataPhotosService],
    }).compile();

    service = module.get<NominataPhotosService>(NominataPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FieldRepsService } from './field-reps.service';

describe('FieldRepsService', () => {
  let service: FieldRepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldRepsService],
    }).compile();

    service = module.get<FieldRepsService>(FieldRepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

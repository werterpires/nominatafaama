import { Test, TestingModule } from '@nestjs/testing';
import { OtherInvitesTimesService } from './other-invites-times.service';

describe('OtherInvitesTimesService', () => {
  let service: OtherInvitesTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtherInvitesTimesService],
    }).compile();

    service = module.get<OtherInvitesTimesService>(OtherInvitesTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

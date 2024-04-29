import { Test, TestingModule } from '@nestjs/testing';
import { OtherInvitesTimesController } from './other-invites-times.controller';
import { OtherInvitesTimesService } from './other-invites-times.service';

describe('OtherInvitesTimesController', () => {
  let controller: OtherInvitesTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherInvitesTimesController],
      providers: [OtherInvitesTimesService],
    }).compile();

    controller = module.get<OtherInvitesTimesController>(OtherInvitesTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

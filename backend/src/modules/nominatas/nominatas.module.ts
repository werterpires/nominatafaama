import { Module } from '@nestjs/common';
import { NominatasService } from './nominatas.service';
import { NominatasController } from './nominatas.controller';

@Module({
  controllers: [NominatasController],
  providers: [NominatasService]
})
export class NominatasModule {}

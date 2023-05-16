import { Module } from '@nestjs/common';
import { UnionsService } from './unions.service';
import { UnionsController } from './unions.controller';

@Module({
  controllers: [UnionsController],
  providers: [UnionsService]
})
export class UnionsModule {}

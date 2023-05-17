import { Module } from '@nestjs/common';
import { UnionsService } from './services/unions.service';
import { UnionsController } from './controller/unions.controller';
import { UnionsModel } from './model/unions.model';

const services = [
 UnionsService,
 UnionsModel,
];

@Module({
  controllers: [UnionsController],
  providers: services,
  exports: services
})
export class UnionsModule {}

import { Module } from '@nestjs/common';
import { MaritalStatusModule } from './marital-status/marital-status.module';
import { UnionsModule } from './unions/unions.module';
import { AssociationsModule } from './associations/associations.module';
import { HiringStatusModule } from './hiring-status/hiring-status.module';

@Module({
  imports: [MaritalStatusModule, UnionsModule, AssociationsModule, HiringStatusModule]
})
export class ResourcesModule {}

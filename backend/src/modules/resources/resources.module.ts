import { Module } from '@nestjs/common';
import { MaritalStatusModule } from './marital-status/marital-status.module';

@Module({
  imports: [MaritalStatusModule]
})
export class ResourcesModule {}

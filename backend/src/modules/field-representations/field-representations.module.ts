import { Module } from '@nestjs/common';
import { FieldRepresentationsService } from './field-representations.service';
import { FieldRepresentationsController } from './field-representations.controller';

@Module({
  controllers: [FieldRepresentationsController],
  providers: [FieldRepresentationsService]
})
export class FieldRepresentationsModule {}

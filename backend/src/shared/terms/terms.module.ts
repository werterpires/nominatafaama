import { Module } from '@nestjs/common';
import { TermsService } from './services/terms.service';
import { TermsController } from './controllers/terms.controller';
import { TermsModel } from './model/terms.model';

const services = [TermsService, TermsModel];

@Module({
  controllers: [TermsController],
  providers: services,
  exports: services,
})
export class TermsModule {}

import { Module } from '@nestjs/common';
import { LanguageTypesService } from './services/language-types.service';
import { LanguageTypesController } from './controllers/language-types.controller';
import { LanguageTypesModel } from './model/language-types.model';

const services = [LanguageTypesModel, LanguageTypesService]

@Module({
  controllers: [LanguageTypesController],
  providers: services,
  exports: services,
})
export class LanguageTypesModule {}

import {Module} from '@nestjs/common';
import {PublicationTypesService} from './services/publication-types.service';
import {PublicationTypesController} from './controllers/publication-types.controller';
import {PublicationTypeModel} from './model/publication-types.model';

const services = [PublicationTypesService, PublicationTypeModel];

@Module({
  controllers: [PublicationTypesController],
  providers: services,
  exports: services,
})
export class PublicationTypesModule {}

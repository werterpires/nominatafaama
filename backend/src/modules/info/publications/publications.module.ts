import { Module } from '@nestjs/common';
import { PublicationsService } from './services/publications.service';
import { PublicationsController } from './controlllers/publications.controller';
import { PublicationsModel } from './model/publications.model';
import { UsersModule } from 'src/modules/users/users.module';
import { PeopleModule } from 'src/modules/people/people.module';
import { SpousesModule } from 'src/modules/spouses/spouses.module';

const services = [PublicationsService, PublicationsModel];

@Module({
  imports: [UsersModule, PeopleModule, SpousesModule],
  controllers: [PublicationsController],
  providers: services,
  exports: services,
})
export class PublicationsModule {}

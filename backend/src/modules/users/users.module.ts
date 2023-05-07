import { Module } from '@nestjs/common';
import { UsersController } from './cz_controllers/users.controller';
import { UsersService } from './dz_services/users.service';
import { UsersModel } from './ez_model/users.model';

const services = [
  UsersService,
  UsersModel,
];

@Module({
  imports: [],
  controllers: [UsersController],
  providers: services,
  exports: services,
})
export class UsersModule {}

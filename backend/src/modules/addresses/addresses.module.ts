import { Module } from '@nestjs/common';
import { AddressesController } from './controllers/addresses.controller';
import { FindAllAddressesService } from './services/findAllAddresses.service';
import { AddressesModel } from './model/addresses.model';
import { CreateAddresseservice } from './services/createAddress.service';

const services = [
  FindAllAddressesService,
  AddressesModel,
  CreateAddresseservice,
];

@Module({
  imports: [],
  controllers: [AddressesController],
  providers: services,
  exports: services,
})
export class AddressesModule {}

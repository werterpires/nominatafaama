import { Injectable } from '@nestjs/common';
import { AddressesModel } from '../model/addresses.model';

@Injectable()
export class FindAllAddressesService {
  constructor(private readonly addressesModel: AddressesModel) {}

  async findAllAddresses() {
    const allAddresses = await this.addressesModel.findAllAddresses();
    return allAddresses;
  }
}

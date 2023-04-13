import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from '../dto/createAddressDto';
import { AddressesModel } from '../model/addresses.model';

@Injectable()
export class CreateAddresseservice {
  constructor(private readonly addressesModel: AddressesModel) {}

  async createAddress({
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    referencePoint,
    zipCode,
    mailbox,
  }: CreateAddressDto) {
    if (complement === undefined) {
      complement = null;
    }
    if (referencePoint === undefined) {
      referencePoint = null;
    }
    if (mailbox === undefined) {
      mailbox = null;
    }
    const address = await this.addressesModel.createAddress({
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      referencePoint,
      zipCode,
      mailbox,
    });
    return address;
  }
}

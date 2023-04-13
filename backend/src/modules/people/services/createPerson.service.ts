import { Injectable } from '@nestjs/common';
import { AddressesModel } from 'src/modules/addresses/model/addresses.model';
import { CreatePersonDto } from '../dto/createPeopleDto';
import { PeopleModel } from '../model/people.model';

@Injectable()
export class CreatePersonService {
  constructor(private readonly peopleModel: PeopleModel, private readonly addressesModel: AddressesModel) {}

  async createPerson({
    firstName,
    surname,
    email,
    cpf,
    addressId,
    address
  }: CreatePersonDto) {
    if(addressId != null){
      const person = await this.peopleModel.createPerson({
        firstName,
        surname,
        email,
        cpf,
        addressId,
      });
      return person;
    }else if(address != null){
      const address2 = await this.addressesModel.createAddress(address);
      const person = await this.peopleModel.createPerson({
        firstName,
        surname,
        email,
        cpf,
        addressId: address2,
      });
      return person;
    }
  }
}

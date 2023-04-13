import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreatePerson, IPerson } from '../types';

@Injectable()
export class PeopleModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAllPeople() {
    const allPeople: IPerson[] = await this.knex
      .table('people as p')
      .leftJoin('addresses as a', 'p.address_id', 'a.address_id');

    return allPeople;
  }

  async createPerson({
    firstName,
    surname,
    email,
    cpf,
    addressId,
  }: ICreatePerson) {
    const person: IPerson = await this.knex.table('people').insert({
      first_names: firstName,
      surname,
      email,
      cpf,
      address_id: addressId,
    });

    return person;
  }
}

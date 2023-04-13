import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateAddress, IAddress } from '../types';

// Declara o serviço "AddressesModel" (Modelo de endereços)
@Injectable()
export class AddressesModel {
  constructor(
    // Injeta o objeto "Knex" (Knex)
    @InjectModel() private readonly knex: Knex,
  ) {}

  // Método para encontrar todos os endereços
  async findAllAddresses() {
    // Consulta a tabela "addresses" (Endereços) e armazena o resultado em "allAddresses" (Todos os endereços)
    const allAddresses: IAddress[] = await this.knex.table('addresses as u');

    // Retorna "allAddresses" (Todos os endereços)
    return allAddresses;
  }

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
  }: ICreateAddress):Promise<number> {
    // Insere um novo endereço na tabela "addresses" (Endereços) e armazena o resultado em "address" (Endereço)
    const address: number = await this.knex.table('addresses').insert({
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      reference_point: referencePoint,
      zip_code: zipCode,
      mailbox,
    });

    // Retorna "address" (Endereço)
    return address;
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from '../az_dto/createPeopleDto';
import { PeopleModel } from '../ez_model/people.model';
import { UpdatePersonDto } from '../az_dto/updatePeopleDto';
import { IPerson } from '../bz_types/types';

@Injectable()
export class PeopleServices {
  constructor(private readonly peopleModel: PeopleModel) {}

  async createPerson({ name, cpf }: CreatePersonDto) {
    const person = await this.peopleModel.createPerson({
      name,
      cpf,
    });
    return person;
  }

  async findPersonById(id: string): Promise<IPerson> {
    const parsedId = parseInt(id, 10);
    const person = await this.peopleModel.findPersonById(parsedId);
    if (person == null) {
      throw new Error(`Person with id ${id} not found`);
    }
    return person;
  }

  async findAllPeople() {
    const allPeople = await this.peopleModel.findAllPeople();
    return allPeople;
  }

  async updatePersonById(person: UpdatePersonDto): Promise<IPerson> {
    const updatedPerson = await this.peopleModel.updatePersonById(person);

    return updatedPerson;
  }
}

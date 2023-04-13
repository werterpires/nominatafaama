import { Injectable } from '@nestjs/common';
import { PeopleModel } from '../model/people.model';

@Injectable()
export class FindAllPeopleService {
  constructor(private readonly peopleModel: PeopleModel) {}

  async findAllPeople() {
    const allPeople = await this.peopleModel.findAllPeople();
    return allPeople;
  }
}

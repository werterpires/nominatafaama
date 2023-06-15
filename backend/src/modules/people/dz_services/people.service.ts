import { Injectable } from '@nestjs/common'
import { CreatePersonDto } from '../az_dto/createPeopleDto'
import { PeopleModel } from '../ez_model/people.model'
import { UpdatePersonDto } from '../az_dto/updatePeopleDto'
import { IPerson } from '../bz_types/types'
import { UsersModel } from 'src/modules/users/ez_model/users.model'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { ISpouse } from 'src/modules/spouses/types/types'

@Injectable()
export class PeopleServices {
  constructor(
    private readonly peopleModel: PeopleModel,
    private usersModel: UsersModel,
    private spouseModel: SpousesModel,
  ) {}

  async createPerson({ name, cpf }: CreatePersonDto) {
    const person = await this.peopleModel.createPerson({
      name,
      cpf,
    })
    return person
  }

  async findPersonById(id: string): Promise<IPerson> {
    const parsedId = parseInt(id, 10)
    const person = await this.peopleModel.findPersonById(parsedId)
    if (person == null) {
      throw new Error(`Person with id ${id} not found`)
    }
    return person
  }

  async findAllPeople() {
    const allPeople = await this.peopleModel.findAllPeople()
    return allPeople
  }

  async updatePersonById(person: UpdatePersonDto): Promise<IPerson> {
    const updatedPerson = await this.peopleModel.updatePersonById(person)

    return updatedPerson
  }

  async findPersonByUserId(
    user_id: number,
    personType: string,
  ): Promise<number | null> {
    let personId!: number | null
    try {
      if (personType === 'student') {
        personId = (await this.usersModel.findUserById(user_id)).person_id
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          personId = null
        }else{
          personId = spouse.person_id
        }
        
      }
    } catch (error) {
      console.error(error)
      throw error
    }

    return personId
  }
}

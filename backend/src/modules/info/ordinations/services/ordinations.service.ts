import { Injectable } from '@nestjs/common';
import {
  IOrdination,
  ICreateOrdination,
  IUpdateOrdination,
} from '../types/types';
import { OrdinationsModel } from '../model/ordinations.model';
import { CreateOrdinationDto } from '../dto/create-ordination.dto';
import { UpdateOrdinationDto } from '../dto/update-ordination.dto';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class OrdinationsService {
  constructor(
    private ordinationsModel: OrdinationsModel,
    private peopleService: PeopleServices
  ) {}

  async createOrdination(
    dto: CreateOrdinationDto,
    user_id: number,
    personType: string,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      let personId = await this.peopleService.findPersonByUserId(
        user_id,
        personType
      );

      if (personId == null) {
        throw new Error(
          `Não foi encontrado uma pessoa vinculada ao usuário ${user_id}`
        );
      }

      const createOrdinationData: ICreateOrdination = {
        ...dto,
        person_id: personId,
        ordination_approved: null,
      };

      const ordinationId = await this.ordinationsModel.createOrdination(
        createOrdinationData,
        currentUser
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async findOrdinationById(id: number): Promise<IOrdination | null> {
    try {
      const ordination = await this.ordinationsModel.findOrdinationById(id);
      return ordination;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a ordenação com o ID ${id}: ${error.message}`
      );
    }
  }

  async findOrdinationsByPersonId(
    user_id: number,
    personType: string
  ): Promise<IOrdination[] | null> {
    try {
      let personId = await this.peopleService.findPersonByUserId(
        user_id,
        personType
      );

      if (personId == null) {
        return [];
      }

      const ordinations = await this.ordinationsModel.findOrdinationsByPersonId(
        personId
      );
      return ordinations;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar ordenações para a pessoa com o ID fornecido: ${error.message}`
      );
    }
  }

  async findAllOrdinations(): Promise<IOrdination[]> {
    try {
      const allOrdinations = await this.ordinationsModel.findAllOrdinations();
      return allOrdinations;
    } catch (error) {
      throw error;
    }
  }

  async updateOrdinationById(
    dto: UpdateOrdinationDto,
    currentUser: UserFromJwt
  ): Promise<IOrdination> {
    try {
      const updateOrdinationData: IUpdateOrdination = {
        ...dto,
        ordination_approved: null,
      };
      const ordinationId = await this.ordinationsModel.updateOrdinationById(
        updateOrdinationData,
        currentUser
      );

      const updatedOrdination = this.ordinationsModel.findOrdinationById(
        updateOrdinationData.ordination_id
      );

      return updatedOrdination;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrdinationById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      await this.ordinationsModel.deleteOrdinationById(id, currentUser);
      return 'Ordenação deletada com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}

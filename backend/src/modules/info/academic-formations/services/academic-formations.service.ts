import { Injectable } from '@nestjs/common';
import { IAcademicFormation, ICreateAcademicFormation, IUpdateAcademicFormation } from '../types/types';
import { CreateAcademicFormationDto } from '../dto/create-academic-formation.dto';
import { UpdateAcademicFormationDto } from '../dto/update-academic-formation.dto';
import { AcademicFormationsModel } from '../model/academic-formations.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';

@Injectable()
export class AcademicFormationsService {
  constructor(
    private academicFormationsModel: AcademicFormationsModel,
    private usersService: UsersService,
    private spouseModel: SpousesModel
    ){}

  async createStudentAcademicFormation(dto: CreateAcademicFormationDto, id:number): Promise<IAcademicFormation> {
    try {
      
      const {person_id} = await this.usersService.findUserById(id)

      const createAcademicFormation: ICreateAcademicFormation = {
        course_area: dto.course_area,
        institution: dto.institution,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date ? new Date(dto.conclusion_date) : null,
        person_id: person_id,
        degree_id: dto.degree_id,
    
      };

      const newAcademicFormation = await this.academicFormationsModel.createAcademicFormation(createAcademicFormation);
      return newAcademicFormation;
    } catch (error) {
      throw error;
    }
  }

  async createSpouseAcademicFormation(dto: CreateAcademicFormationDto, id:number): Promise<IAcademicFormation> {
    try {
      
      const {person_id} = await this.spouseModel.findSpouseByUserId(id)

      const createAcademicFormation: ICreateAcademicFormation = {
        course_area: dto.course_area,
        institution: dto.institution,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date ? new Date(dto.conclusion_date) : null,
        person_id: person_id,
        degree_id: dto.degree_id,
    
      };

      const newAcademicFormation = await this.academicFormationsModel.createAcademicFormation(createAcademicFormation);
      return newAcademicFormation;
    } catch (error) {
      throw error;
    }
  }

  async findAcademicFormationById(id: number): Promise<IAcademicFormation | null> {
    try {
      const academicFormation = await this.academicFormationsModel.findAcademicFormationById(id);
      return academicFormation;
    } catch (error) {
      throw new Error(`Não foi possível encontrar a formação acadêmica com o id ${id}: ${error.message}`);
    }
  }

  async findStudentAcademicFormationByPersonId(id: number): Promise<IAcademicFormation[] | null> {
    try {

      const {person_id} = await this.usersService.findUserById(id)

      const academicFormation = await this.academicFormationsModel.findAcademicFormationsByPersonId(person_id);
      return academicFormation;
    } catch (error) {
      throw new Error(`Não foi possível encontrar formações acadêmicas para o usuário com id ${id}: ${error.message}`);
    }
  }

  async findSpouseAcademicFormationByPersonId(id: number): Promise<IAcademicFormation[] | null> {
    try {

      const {person_id} = await this.spouseModel.findSpouseByUserId(id)

      const academicFormation = await this.academicFormationsModel.findAcademicFormationsByPersonId(person_id);
      return academicFormation;
    } catch (error) {
      throw new Error(`Não foi possível encontrar formações acadêmicas para o usuário com id ${id}: ${error.message}`);
    }
  }

  async findAllAcademicFormations(): Promise<IAcademicFormation[]> {
    try {
      const academicFormations = await this.academicFormationsModel.findAllAcademicFormations();
      return academicFormations;
    } catch (error) {
      throw error;
    }
  }

  async updateAcademicFormationById(id: number, dto: UpdateAcademicFormationDto): Promise<IAcademicFormation> {
    try {
  
      const updatedAcademicFormation: IUpdateAcademicFormation = {
        formation_id: id,
        course_area: dto.course_area,
        institution: dto.institution,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date ? new Date(dto.conclusion_date) : null,
        degree_id: dto.degree_id,
    
      };

      const updatedFormation = await this.academicFormationsModel.updateAcademicFormationById(updatedAcademicFormation);
      return updatedFormation;
    } catch (error) {
      throw error;
    }
  }

  async deleteAcademicFormationById(id: number): Promise<string> {
    try {
     
      await this.academicFormationsModel.deleteAcademicFormationById(id);

      return 'Formação acadêmica deletada com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}
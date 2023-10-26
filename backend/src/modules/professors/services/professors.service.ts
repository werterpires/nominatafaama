import { Injectable } from '@nestjs/common';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { CreateProfessorAssignmentDto } from '../dto/create-professors.dto';
import { UpdateProfessorAssgnmentDto } from '../dto/update-professors.dto';
import { ProfessorsModel } from '../model/professors.model';
import {
  ICreateProfessorAssgnment,
  IProfessor,
  IUpdateProfessor,
} from '../types/types';
import * as fs from 'fs';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class ProfessorsService {
  constructor(
    private professorsModel: ProfessorsModel,
    private peopleService: PeopleServices,
    private usersService: UsersService
  ) {}

  async createProfessor(
    dto: CreateProfessorAssignmentDto,
    currentUser: UserFromJwt,
    userId?: number
  ): Promise<IProfessor> {
    try {
      if (userId) {
        const user = await this.usersService.findUserById(userId);
        if (user == null) {
          throw new Error('Nenhum Usuário válido foi encontrado.');
        }
        const person_id = user.person_id;

        const professor: ICreateProfessorAssgnment = {
          approved: true,
          assignments: dto.assignments,
          person_id: person_id,
        };

        const newProfessor = await this.professorsModel.createProfessor(
          professor,
          currentUser
        );
        return newProfessor;
      } else {
        if (dto.cpf && dto.name) {
          const professor = {
            approved: true,
            assignments: dto.assignments,
            cpf: dto.cpf,
            name: dto.name,
          };
          const newProfessor = await this.professorsModel.createProfessor(
            professor,
            currentUser
          );
          return newProfessor;
        } else {
          throw new Error('Parâmetros insuficientes para criar um professor.');
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async findProfessorByIdToEdit(id: number): Promise<IProfessor> {
    try {
      const professor = await this.professorsModel.findProfessorByUserId(id);
      return professor as IProfessor;
    } catch (error) {
      console.error(error);
      return null as any;
    }
  }

  async updateProfessorById(
    input: UpdateProfessorAssgnmentDto
  ): Promise<IProfessor> {
    let updatedProfessor: IProfessor | null = null;
    let sentError: Error | null = null;

    const updateData: IUpdateProfessor = {
      ...input,
      approved: true,
    };

    try {
      updatedProfessor = await this.professorsModel.updateProfessorById(
        updateData
      );
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedProfessor === null) {
      throw new Error('Failed to update professor');
    }
    if (updatedProfessor) {
      return updatedProfessor;
    }
    throw new Error('Não foi possível atualizar o professor');
  }

  async createProfessorPhoto(
    user_id: number,
    filename: string
  ): Promise<null | number> {
    try {
      const professor = await this.professorsModel.findProfessorByUserId(
        user_id
      );

      if (professor == null) {
        throw new Error('Professor não encontrado');
      }

      const oldFile = professor.professor_photo_address;

      if (oldFile != null && oldFile.length > 5) {
        const filePath = `./src/modules/professors/files/${oldFile}`;

        await fs.promises.unlink(filePath);
      }

      const professor_id = professor.professor_id;

      this.professorsModel.updateProfessorPhoto(filename, professor_id);

      return 1;
    } catch (error) {
      console.error(
        'Erro capturado no ProfessorsService createProfessorPhoto: ',
        error
      );
      throw error;
    }
  }

  async createProfessorPhotoByProfessorId(
    professor_id: number,
    filename: string
  ): Promise<null | number> {
    try {
      const professor = await this.professorsModel.findProfessorById(
        professor_id
      );

      if (professor == null) {
        throw new Error('Professor não encontrado');
      }

      const oldFile = professor.professor_photo_address;

      if (oldFile != null && oldFile.length > 5) {
        const filePath = `./src/modules/professors/files/${oldFile}`;

        await fs.promises.unlink(filePath);
      }

      this.professorsModel.updateProfessorPhoto(filename, professor_id);

      return 1;
    } catch (error) {
      console.error(
        'Erro capturado no ProfessorsService createProfessorPhoto: ',
        error
      );
      throw error;
    }
  }

  async findProfessorPhotoByUserId(user_id: number): Promise<{
    fileStream: fs.ReadStream | null;
    headers: Record<string, string>;
  }> {
    try {
      const professor = await this.professorsModel.findProfessorByUserId(
        user_id
      );

      if (professor == null) {
        return {
          fileStream: null,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename`,
          },
        };
      }

      const filename = professor.professor_photo_address;

      const filePath = `./src/modules/professors/files/${filename}`;

      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${filename}`,
        };
        return { fileStream, headers };
      } else {
        return { fileStream: null, headers: {} };
      }
    } catch (error) {
      console.error(
        'Erro capturado no ProfessorService findProfessorPhotoByStudentId: ',
        error
      );
      throw error;
    }
  }

  async findProfessorPhotoByProfessorId(professorId: number): Promise<{
    fileStream: fs.ReadStream | null;
    headers: Record<string, string>;
  }> {
    try {
      const professor = await this.professorsModel.findProfessorById(
        professorId
      );

      if (professor == null) {
        return {
          fileStream: null,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename`,
          },
        };
      }

      const filename = professor.professor_photo_address;

      const filePath = `./src/modules/professors/files/${filename}`;

      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${filename}`,
        };
        return { fileStream, headers };
      } else {
        return { fileStream: null, headers: {} };
      }
    } catch (error) {
      console.error(
        'Erro capturado no ProfessorService findProfessorPhotoByStudentId: ',
        error
      );
      throw error;
    }
  }

  async deleteProfessorById(id: number): Promise<string> {
    try {
      const message = await this.professorsModel.deleteProfessorById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
}

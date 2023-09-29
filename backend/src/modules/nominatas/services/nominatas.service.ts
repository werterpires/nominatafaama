import { Injectable } from '@nestjs/common';
import { CreateNominataDto } from '../dto/create-nominata.dto';
import { UpdateNominataDto } from '../dto/update-nominata.dto';
import { NominatasModel } from '../model/nominatas.model';
import {
  IBasicProfessor,
  IBasicStudent,
  ICreateNominata,
  ICreateNominataProfessors,
  ICreateNominataStudents,
  INominata,
  ISinteticProfessor,
  ISinteticStudent,
  IUpdateNominata,
} from '../types/types';
import * as fs from 'fs';
import { EventsModel } from 'src/modules/events/model/events.model';

@Injectable()
export class NominatasService {
  constructor(
    private nominatasModel: NominatasModel,
    private eventsModel: EventsModel
  ) {}

  async createNominata(dto: CreateNominataDto): Promise<INominata> {
    try {
      const createNominataData: ICreateNominata = {
        year: dto.year,
        orig_field_invites_begin: new Date(dto.orig_field_invites_begin),
        director_words: dto.director_words,
        director: dto.director,
      };

      const newNominata = await this.nominatasModel.createNominata(
        createNominataData
      );
      return newNominata;
    } catch (error) {
      throw error;
    }
  }

  async addStudentsToNominata(
    createNominataStudentsData: ICreateNominataStudents
  ): Promise<boolean> {
    try {
      const { nominata_id, student_id } = createNominataStudentsData;
      const result = await this.nominatasModel.addStudentsToNominata(
        student_id,
        nominata_id
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProfessorsToNominata(
    createNominataProfessorsData: ICreateNominataProfessors
  ): Promise<boolean> {
    try {
      const { nominata_id, professor_id } = createNominataProfessorsData;
      const result = await this.nominatasModel.addProfessorsToNominata(
        professor_id,
        nominata_id
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findNominataByYear(year: string): Promise<INominata> {
    try {
      const nominata = await this.nominatasModel.findNominataByYear(year);
      let photosInfo: {
        fileStream: fs.ReadStream | null;
        headers: Record<string, string>;
      }[] = [];

      if (nominata) {
        const { nominata_id } = nominata;

        // const photo = await this.findNominaPhoto(nominata.class_photo);
        // nominata.photo = photo;

        const students = await this.findNominataBasicStudents(nominata_id);
        nominata.students = students;

        const professors = await this.findNominataBasicProfessors(nominata_id);
        nominata.professors = professors;

        const events = await this.eventsModel.findAllEventsByNominataId(
          nominata_id
        );
        nominata.events = events;
      }

      return nominata as INominata;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar uma nominata com ano ${year}: ${error.message}`
      );
    }
  }

  async findNominataBasicStudents(
    nominata_id: number
  ): Promise<IBasicStudent[] | null> {
    try {
      let students = await this.nominatasModel.findAllNominataBasicStudents(
        nominata_id
      );

      if (students == null) {
        return null;
      }

      // for (const student of students) {
      //   if (student.small_alone_photo == null) {
      //     student.photo = null;
      //   } else {
      //     const filePath = `./src/modules/info/student-photos/files/${student.small_alone_photo}`;

      //     if (!fs.existsSync(filePath)) {
      //       student.photo = null;
      //     } else {
      //       const fileStream = fs.createReadStream(filePath);
      //       const headers = {
      //         'Content-Type': 'image/jpeg',
      //         'Content-Disposition': `attachment; filename=${student.small_alone_photo}`,
      //       };

      //       const filePromise = new Promise<Buffer>((resolve, reject) => {
      //         const chunks: Buffer[] = [];
      //         fileStream.on('data', (chunk: Buffer) => {
      //           chunks.push(chunk);
      //         });
      //         fileStream.on('end', () => {
      //           const file = Buffer.concat(chunks);
      //           resolve(file);
      //         });
      //         fileStream.on('error', (error: Error) => {
      //           reject(error);
      //         });
      //       });

      //       const file = await filePromise;
      //       student.photo = {
      //         file,
      //         headers,
      //       };
      //     }
      //   }
      // }

      return students;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findNominaPhoto(
    address: string | null
  ): Promise<{ file: Buffer; headers: Record<string, string> } | null> {
    try {
      let photo: { file: Buffer; headers: Record<string, string> } | null;
      if (!address) {
        return null;
      } else {
        const filePath = `./src/modules/nominatas/files/${address}`;

        if (!fs.existsSync(filePath)) {
          return null;
        }
        const fileStream = fs.createReadStream(filePath);
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${address}`,
        };

        const filePromise = new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          fileStream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });
          fileStream.on('end', () => {
            const file = Buffer.concat(chunks);
            resolve(file);
          });
          fileStream.on('error', (error: Error) => {
            reject(error);
          });
        });

        const file = await filePromise;
        photo = {
          file,
          headers,
        };
      }

      return photo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findNominataBasicProfessors(
    nominata_id: number
  ): Promise<IBasicProfessor[] | null> {
    try {
      let professors = await this.nominatasModel.findAllNominataBasicProfessors(
        nominata_id
      );

      if (professors == null) {
        return null;
      }
      // for (const professor of professors) {
      //   if (professor.professor_photo_address == null) {
      //     professor.photo = null;
      //   } else {
      //     const filePath = `./src/modules/professors/files/${professor.professor_photo_address}`;

      //     if (!fs.existsSync(filePath)) {
      //       professor.photo = null;
      //     } else {
      //       const fileStream = fs.createReadStream(filePath);
      //       const headers = {
      //         'Content-Type': 'image/jpeg',
      //         'Content-Disposition': `attachment; filename=${professor.professor_photo_address}`,
      //       };

      //       const filePromise = new Promise<Buffer>((resolve, reject) => {
      //         const chunks: Buffer[] = [];
      //         fileStream.on('data', (chunk: Buffer) => {
      //           chunks.push(chunk);
      //         });
      //         fileStream.on('end', () => {
      //           const file = Buffer.concat(chunks);
      //           resolve(file);
      //         });
      //         fileStream.on('error', (error: Error) => {
      //           reject(error);
      //         });
      //       });

      //       const file = await filePromise;
      //       professor.photo = {
      //         file,
      //         headers,
      //       };
      //     }
      //   }
      // }

      return professors;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllNominatas(): Promise<INominata[]> {
    try {
      const nominatas = await this.nominatasModel.findAllNominatas();
      return nominatas;
    } catch (error) {
      throw error;
    }
  }

  async findAllNOminataStudents(): Promise<ISinteticStudent[]> {
    try {
      const students = await this.nominatasModel.findAllNominataStudents();
      return students;
    } catch (error) {
      throw error;
    }
  }

  async findAllNOminataProfessors(): Promise<ISinteticProfessor[]> {
    try {
      const professors = await this.nominatasModel.findAllNominataProfessors();

      return professors;
    } catch (error) {
      throw error;
    }
  }

  async findNominataPhotoByNominataId(nominataId: number): Promise<{
    fileStream: fs.ReadStream | null;
    headers: Record<string, string>;
  }> {
    try {
      const address = await this.nominatasModel.findNominataPhotoByNominataId(
        nominataId
      );

      if (address == null) {
        return {
          fileStream: null,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename`,
          },
        };
      }

      const filePath = `./src/modules/nominatas/files/${address}`;

      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${address}`,
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

  async updateNominataById(input: UpdateNominataDto): Promise<INominata> {
    let updatedNominata: INominata | null = null;
    let sentError: Error | null = null;

    try {
      const updateNominataData: IUpdateNominata = {
        nominata_id: input.nominata_id,
        orig_field_invites_begin: new Date(input.orig_field_invites_begin),
        year: input.year,
        director_words: input.director_words,
      };

      updatedNominata = await this.nominatasModel.updateNominataById(
        updateNominataData
      );
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedNominata === null) {
      throw new Error('O grau acadêmico não pôde ser atualizado.');
    }

    return updatedNominata;
  }

  async createNominataPhoto(
    nominataId: number,
    filename: string
  ): Promise<null | number> {
    try {
      const nominata = await this.nominatasModel.findNominataById(nominataId);

      if (nominata == null) {
        throw new Error('Nominata não encontrada');
      }

      const oldFile = nominata.class_photo;

      if (oldFile != null && oldFile.length > 5) {
        const filePath = `./src/modules/nominatas/files/${oldFile}`;

        const fileExists = await fs.promises
          .access(filePath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          await fs.promises.unlink(filePath);
        }
      }

      const nominata_id = nominata.nominata_id;

      this.nominatasModel.updateNominataPhoto(filename, nominata_id);

      return 1;
    } catch (error) {
      console.error(
        'Erro capturado no NominatasService createNominataPhoto: ',
        error
      );
      throw error;
    }
  }

  async deleteNominataById(id: number): Promise<string> {
    try {
      const message = await this.nominatasModel.deleteNominataById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
}

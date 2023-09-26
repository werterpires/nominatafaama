import { Injectable } from '@nestjs/common';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { StudentsModel } from '../model/students.model';
import { ICreateStudent, IStudent, IUpdateStudent } from '../types/types';
import {
  ICompleteStudent,
  ICompleteUser,
} from 'src/modules/approvals/types/types';
import { IUser } from 'src/modules/users/bz_types/types';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { AcademicFormationsModel } from 'src/modules/info/academic-formations/model/academic-formations.model';
import { LanguagesModel } from 'src/modules/info/languages/model/languages.model';
import { CoursesModel } from 'src/modules/info/courses/model/courses.model';
import { ProfessionalExperiencesModel } from 'src/modules/info/professional-experiences/model/professional-experiences.model';
import { PastEclExpsModel } from 'src/modules/info/past-ecl-experiences/model/past-ecl-experiences.model';
import { EvangelisticExperiencesModel } from 'src/modules/info/evangelistic-experiences/model/evang-experiences.model';
import { EclExperiencesModel } from 'src/modules/info/ecl-experiences/model/ecl-experiences.model';
import { PublicationsModel } from 'src/modules/info/publications/model/publications.model';
import { EndowmentsModel } from 'src/modules/info/endowments/model/endowments.model';
import { OrdinationsModel } from 'src/modules/info/ordinations/model/ordinations.model';
import { RelatedMinistriesModel } from 'src/modules/info/related-ministries/model/related-ministries.model';
import { PreviousMarriagesModel } from 'src/modules/info/previous-marriage/model/previous-marriage.model';
import { ChildrenModel } from 'src/modules/info/children/model/children.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import * as fs from 'fs';
import { StudentPhotosService } from 'src/modules/info/student-photos/services/student-photos.service';
@Injectable()
export class StudentsService {
  constructor(
    private studentsModel: StudentsModel,
    private peopleService: PeopleServices,
    private usersService: UsersService,
    private usersModel: UsersModel,
    private academicFormationsModel: AcademicFormationsModel,
    private languagesModel: LanguagesModel,
    private coursesModel: CoursesModel,
    private professionalExperiencesModel: ProfessionalExperiencesModel,
    private pastEclExpsModel: PastEclExpsModel,
    private evangelisticExperiencesModel: EvangelisticExperiencesModel,
    private eclExperiencesModel: EclExperiencesModel,
    private publicationsModel: PublicationsModel,
    private endowmentsModel: EndowmentsModel,
    private ordinationsModel: OrdinationsModel,
    private relatedMinistriesModel: RelatedMinistriesModel,
    private previousMarriagesModel: PreviousMarriagesModel,
    private childrenService: ChildrenModel,
    private spousesModel: SpousesModel,
    private studentPhotoService: StudentPhotosService
  ) {}

  async createStudent(
    dto: CreateStudentDto,
    userId: number
  ): Promise<IStudent> {
    try {
      const user = await this.usersService.findUserById(userId);
      if (user == null) {
        throw new Error('Nenhum Usuário válido foi encontrado.');
      }
      const name = user.name;
      const person_id = user.person_id;

      const birthDate = new Date(dto.birth_date);
      const baptismDate = new Date(dto.baptism_date);

      const student: ICreateStudent = {
        phone_number: dto.phone_number,
        is_whatsapp: dto.is_whatsapp,
        alternative_email: dto.alternative_email,
        student_mensage: dto.student_mensage,
        person_id: person_id,
        origin_field_id: dto.origin_field_id,
        justification: dto.justification,
        birth_city: dto.birth_city,
        birth_state: dto.birth_state,
        primary_school_city: dto.primary_school_city,
        birth_date: birthDate,
        baptism_date: baptismDate,
        baptism_place: dto.baptism_place,
        marital_status_id: dto.marital_status_id,
        hiring_status_id: 1,
        primary_school_state: dto.primary_school_state,
        student_approved: null,
      };

      const newStudent = await this.studentsModel.createStudent(student, name);
      return newStudent;
    } catch (error) {
      throw error;
    }
  }

  async findStudentById(id: number): Promise<IStudent> {
    try {
      const student = await this.studentsModel.findStudentById(id);
      return student as IStudent;
    } catch (error) {
      console.error(error);
      return null as any;
    }
  }

  async findStudentByIdToEdit(id: number): Promise<IStudent> {
    try {
      const student = await this.studentsModel.findStudentByUserId(id);
      return student as IStudent;
    } catch (error) {
      console.error(error);
      return null as any;
    }
  }

  async findOneStudent(studentId: number): Promise<ICompleteStudent> {
    const completeStudent: ICompleteStudent = {
      student: null,
      spouse: null,
      academicFormations: null,
      spAcademicFormations: null,
      languages: null,
      spLanguages: null,
      courses: null,
      spCourses: null,
      previousMarriage: null,
      professionalExperiences: null,
      spProfessionalExperiences: null,
      pastEclExps: null,
      spPastEclExps: null,
      evangelisticExperiences: null,
      spEvangelisticExperiences: null,
      eclExperiences: null,
      publications: null,
      spPublications: null,
      endowments: null,
      spEndowments: null,
      ordinations: null,
      relatedMinistries: null,
      spRelatedMinistries: null,
      children: null,
      user: null,
      photos: {
        alone_photo: null,
        family_photo: null,
        invite_photo: null,
        other_family_photo: null,
        small_alone_photo: null,
        spouse_photo: null,
      },
    };

    try {
      const student: IStudent | null =
        await this.studentsModel.findApprovedStudentByUserId(studentId);
      completeStudent.student = student;

      if (!student || !student.person_id) {
        return completeStudent;
      }

      const personId = student.person_id;

      let user: IUser | null = await this.usersModel.findApprovedUserByPersonId(
        student.person_id
      );
      if (user) {
        user.cpf = '00000000000';
      }
      completeStudent.user = user;

      const academicFormations =
        await this.academicFormationsModel.findApprovedAcademicFormationsByPersonId(
          personId
        );
      if (academicFormations.length > 0) {
        completeStudent.academicFormations = academicFormations;
      }

      const languages =
        await this.languagesModel.findApprovedLanguagesByPersonId(personId);
      if (languages.length > 0) {
        completeStudent.languages = languages;
      }

      const courses = await this.coursesModel.findApprovedCoursesByPersonId(
        personId
      );
      if (courses.length > 0) {
        completeStudent.courses = courses;
      }

      const professionalExperiences =
        await this.professionalExperiencesModel.findApprovedProfessionalExperiencesByPersonId(
          personId
        );
      if (professionalExperiences.length > 0) {
        completeStudent.professionalExperiences = professionalExperiences;
      }

      const pastEclExps =
        await this.pastEclExpsModel.findApprovedPastEclExpsByPersonId(personId);
      if (pastEclExps.length > 0) {
        completeStudent.pastEclExps = pastEclExps;
      }

      const evangelisticExperiences =
        await this.evangelisticExperiencesModel.findApprovedEvangelisticExperiencesByPersonId(
          personId
        );
      if (evangelisticExperiences.length > 0) {
        completeStudent.evangelisticExperiences = evangelisticExperiences;
      }

      const eclExperiences =
        await this.eclExperiencesModel.findApprovedEclExperiencesByPersonId(
          personId
        );
      if (eclExperiences.length > 0) {
        completeStudent.eclExperiences = eclExperiences;
      }

      const publications =
        await this.publicationsModel.findApprovedPublicationsByPersonId(
          personId
        );
      if (publications.length > 0) {
        completeStudent.publications = publications;
      }

      const endowments =
        await this.endowmentsModel.findApprovedEndowmentsByPersonId(personId);
      if (endowments.length > 0) {
        completeStudent.endowments = endowments;
      }

      const ordinations =
        await this.ordinationsModel.findApprovedOrdinationsByPersonId(personId);
      if (ordinations.length > 0) {
        completeStudent.ordinations = ordinations;
      }

      const relatedMinistries =
        await this.relatedMinistriesModel.findApprovedRelatedMinistriesByPersonId(
          personId
        );
      if (relatedMinistries.length > 0) {
        completeStudent.relatedMinistries = relatedMinistries;
      }

      if (
        student?.marital_status_type_name == 'Divorciado' ||
        student?.marital_status_type_name == 'Viúvo'
      ) {
        const previousMarriage =
          await this.previousMarriagesModel.findApprovedPreviousMarriagesByStudentId(
            studentId
          );
        if (previousMarriage.length > 0) {
          completeStudent.previousMarriage = previousMarriage;
        }
      }

      const children =
        await this.childrenService.findApprovedChildrenByStudentId(studentId);
      if (children.length > 0) {
        completeStudent.children = children;
      }

      if (
        student != null &&
        (student.marital_status_type_name == 'Casado' ||
          student.marital_status_type_name == 'Noivo')
      ) {
        const spouse = await this.spousesModel.findApprovedSpouseByStudentId(
          studentId
        );
        completeStudent.spouse = spouse;

        let spousePersonId;
        if (spouse != null && spouse.spouse_id) {
          spousePersonId = spouse.person_id;

          const spAcademicFormations =
            await this.academicFormationsModel.findApprovedAcademicFormationsByPersonId(
              spousePersonId
            );
          if (spAcademicFormations.length > 0) {
            completeStudent.spAcademicFormations = spAcademicFormations;
          }

          const spLanguages =
            await this.languagesModel.findApprovedLanguagesByPersonId(
              spousePersonId
            );
          if (spLanguages.length > 0) {
            completeStudent.spLanguages = spLanguages;
          }

          const spCourses =
            await this.coursesModel.findApprovedCoursesByPersonId(
              spousePersonId
            );
          if (spCourses.length > 0) {
            completeStudent.spCourses = spCourses;
          }

          const spProfessionalExperiences =
            await this.professionalExperiencesModel.findApprovedProfessionalExperiencesByPersonId(
              spousePersonId
            );
          if (spProfessionalExperiences.length > 0) {
            completeStudent.spProfessionalExperiences =
              spProfessionalExperiences;
          }

          const spPastEclExps =
            await this.pastEclExpsModel.findApprovedPastEclExpsByPersonId(
              spousePersonId
            );
          if (spPastEclExps.length > 0) {
            completeStudent.spPastEclExps = spPastEclExps;
          }

          const spEvangelisticExperiences =
            await this.evangelisticExperiencesModel.findApprovedEvangelisticExperiencesByPersonId(
              spousePersonId
            );
          if (spEvangelisticExperiences.length > 0) {
            completeStudent.spEvangelisticExperiences =
              spEvangelisticExperiences;
          }

          const spPublications =
            await this.publicationsModel.findApprovedPublicationsByPersonId(
              spousePersonId
            );
          if (spPublications.length > 0) {
            completeStudent.spPublications = spPublications;
          }

          const spEndowments =
            await this.endowmentsModel.findApprovedEndowmentsByPersonId(
              spousePersonId
            );
          if (spEndowments.length > 0) {
            completeStudent.spEndowments = spEndowments;
          }

          const spRelatedMinistries =
            await this.relatedMinistriesModel.findApprovedRelatedMinistriesByPersonId(
              spousePersonId
            );
          if (spRelatedMinistries.length > 0) {
            completeStudent.spRelatedMinistries = spRelatedMinistries;
          }
        }
      }

      if (user) {
        await this.createPhotoFile(
          user.user_id,
          completeStudent,
          'small-alone-photo'
        );

        await this.createPhotoFile(
          user.user_id,
          completeStudent,
          'alone-photo'
        );
        await this.createPhotoFile(
          user.user_id,
          completeStudent,
          'family-photo'
        );
        await this.createPhotoFile(
          user.user_id,
          completeStudent,
          'other-family-photo'
        );
        await this.createPhotoFile(
          user.user_id,
          completeStudent,
          'spouse-photo'
        );
        await this.createPhotoFile(
          user.user_id,
          completeStudent,
          'invite-photo'
        );
      }
    } catch (error) {
      console.error(
        'Erro capturado no ApprovalsService findOneNotApproved:',
        error
      );
    }
    console.log('completeStudent:', completeStudent);
    return completeStudent;
  }

  async addPhotos(
    users: ICompleteUser[],
    photosInfo: {
      fileStream: fs.ReadStream | null;
      headers: Record<string, string>;
    }[]
  ) {
    for (let i = 0; i < users.length; i++) {
      if (photosInfo[i].fileStream != null) {
        const { fileStream, headers } = photosInfo[i];

        if (fileStream) {
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
          users[i].photo = {
            file,
            headers,
          };
        }
      } else {
        users[i].photo = null;
      }
    }
  }

  async addPhotoToStudent(photoData: {
    fileStream: fs.ReadStream | null;
    headers: Record<string, string>;
  }): Promise<{
    file: Buffer;
    headers: Record<string, string>;
  } | null> {
    let photo: {
      file: Buffer;
      headers: Record<string, string>;
    } | null = null;
    if (photoData.fileStream != null) {
      const { fileStream, headers } = photoData;

      if (fileStream) {
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
    }
    return photo;
  }

  async createPhotoFile(
    userId: number,
    completeStudent: ICompleteStudent,
    photoType: string
  ) {
    let correctPhotoType = photoType.replace(/-/g, '_');
    let photoData: {
      fileStream: fs.ReadStream | null;
      headers: Record<string, string>;
    };
    photoData = await this.studentPhotoService.findStudentPhotoByStudentId(
      userId,
      photoType
    );
    completeStudent.photos[correctPhotoType] = await this.addPhotoToStudent(
      photoData
    );
  }

  async findAllStudents(): Promise<IStudent[]> {
    try {
      const students = await this.studentsModel.findAllStudents();
      return students;
    } catch (error) {
      throw error;
    }
  }

  async updateStudentById(input: UpdateStudentDto): Promise<IStudent> {
    let updatedStudent: IStudent | null = null;
    let sentError: Error | null = null;

    const birthDate = new Date(input.birth_date);
    const baptismDate = new Date(input.baptism_date);

    const updateData: IUpdateStudent = {
      ...input,
      birth_date: birthDate,
      baptism_date: baptismDate,
      student_approved: null,
    };

    try {
      updatedStudent = await this.studentsModel.updateStudentById(updateData);
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedStudent === null) {
      throw new Error('Failed to update student');
    }
    if (updatedStudent) {
      return updatedStudent;
    }
    throw new Error('deu ruim');
  }

  async deleteStudentById(id: number): Promise<string> {
    try {
      const message = await this.studentsModel.deleteStudentById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common'
import { ICompleteStudent, ICompleteUser } from '../types/types'
import { IUser } from 'src/modules/users/bz_types/types'
import { StudentsModel } from 'src/modules/students/model/students.model'
import { UsersModel } from 'src/modules/users/ez_model/users.model'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { AcademicFormationsModel } from 'src/modules/info/academic-formations/model/academic-formations.model'
import { LanguagesModel } from 'src/modules/info/languages/model/languages.model'
import { CoursesModel } from 'src/modules/info/courses/model/courses.model'
import { PreviousMarriagesModel } from 'src/modules/info/previous-marriage/model/previous-marriage.model'
import { ProfessionalExperiencesModel } from 'src/modules/info/professional-experiences/model/professional-experiences.model'
import { PastEclExpsModel } from 'src/modules/info/past-ecl-experiences/model/past-ecl-experiences.model'
import { EvangelisticExperiencesModel } from 'src/modules/info/evangelistic-experiences/model/evang-experiences.model'
import { EclExperiencesModel } from 'src/modules/info/ecl-experiences/model/ecl-experiences.model'
import { PublicationsModel } from 'src/modules/info/publications/model/publications.model'
import { EndowmentsModel } from 'src/modules/info/endowments/model/endowments.model'
import { OrdinationsModel } from 'src/modules/info/ordinations/model/ordinations.model'
import { RelatedMinistriesModel } from 'src/modules/info/related-ministries/model/related-ministries.model'
import { ChildrenModel } from 'src/modules/info/children/model/children.model'
import * as fs from 'fs'
import { StudentPhotosService } from 'src/modules/info/student-photos/services/student-photos.service'
import { IStudent } from 'src/modules/students/types/types'
import { ISpouse } from 'src/modules/spouses/types/types'
import { IAcademicFormation } from 'src/modules/info/academic-formations/types/types'

@Injectable()
export class ApprovalsService {
  constructor(
    private studentsModel: StudentsModel,
    private usersModel: UsersModel,
    private spousesModel: SpousesModel,
    private academicFormationsModel: AcademicFormationsModel,
    private languagesModel: LanguagesModel,
    private coursesModel: CoursesModel,
    private previousMarriagesModel: PreviousMarriagesModel,
    private professionalExperiencesModel: ProfessionalExperiencesModel,
    private pastEclExpsModel: PastEclExpsModel,
    private evangelisticExperiencesModel: EvangelisticExperiencesModel,
    private eclExperiencesModel: EclExperiencesModel,
    private publicationsModel: PublicationsModel,
    private endowmentsModel: EndowmentsModel,
    private ordinationsModel: OrdinationsModel,
    private relatedMinistriesModel: RelatedMinistriesModel,
    private childrenService: ChildrenModel,
    private studentPhotoService: StudentPhotosService,
  ) {}

  async findNotApproved(): Promise<ICompleteUser[] | null> {
    let users: ICompleteUser[] | null = null
    try {
      let personIds: number[] = []

      const notApprovedStudentPersonIds =
        await this.studentsModel.findNotApprovedIds()
      personIds = this.addPersonIds(personIds, notApprovedStudentPersonIds)

      const notApprovedSpousesPersonIds =
        await this.academicFormationsModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedSpousesPersonIds)

      const notApprovedAcademicFormationsPersonIds =
        await this.spousesModel.findNotApprovedStudentIds()
      personIds = this.addPersonIds(
        personIds,
        notApprovedAcademicFormationsPersonIds,
      )

      const notApprovedLanguagesPersonIds =
        await this.languagesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedLanguagesPersonIds)

      const notApprovedCoursesPersonIds =
        await this.coursesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedCoursesPersonIds)

      const notApprovedPreviousMarriagesPersonIds =
        await this.previousMarriagesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(
        personIds,
        notApprovedPreviousMarriagesPersonIds,
      )

      const notApprovedProfessionalExpPersonIds =
        await this.professionalExperiencesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(
        personIds,
        notApprovedProfessionalExpPersonIds,
      )

      const notApprovedPasEclExpsPersonIds =
        await this.pastEclExpsModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedPasEclExpsPersonIds)

      const notApprovedEvangExpsPersonIds =
        await this.evangelisticExperiencesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedEvangExpsPersonIds)

      const notApprovedEclExpsPersonIds =
        await this.eclExperiencesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedEclExpsPersonIds)

      const notApprovedPublicationsPersonIds =
        await this.publicationsModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedPublicationsPersonIds)

      const notApprovedEndowmentsPersonIds =
        await this.endowmentsModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedEndowmentsPersonIds)

      const notApprovedOrdinationsPersonIds =
        await this.ordinationsModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedOrdinationsPersonIds)

      const notApprovedRelatedMinistriesPersonIds =
        await this.relatedMinistriesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(
        personIds,
        notApprovedRelatedMinistriesPersonIds,
      )

      const notApprovedChildrenPersonIds =
        await this.childrenService.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedChildrenPersonIds)

      const result = await this.usersModel.findUsersByIds(personIds)
      let photosInfo: {
        fileStream: fs.ReadStream | null
        headers: Record<string, string>
      }[] = []
      if (result !== null) {
        users = result

        for (const user of users) {
          const photoData =
            await this.studentPhotoService.findStudentPhotoByStudentId(
              user.user_id,
              'small-alone-photo',
            )

          photosInfo.push(photoData)
        }
        await this.addPhotos(users, photosInfo)
      }
    } catch (error) {
      console.error('Erro capturado no service: ', error)
      throw error
    }

    return users
  }

  async findOneNotApproved(data: {
    personId: number
    userId: number
  }): Promise<ICompleteStudent> {
    const completeStudent: ICompleteStudent = {
      student: null,
      spouse: null,
      academicFormations: null,
      spAcademicFormations: null,
      languages: null,
      spLanguages: null,
      courses: null,
      spCourses: null,
    }

    try {
      const { personId, userId } = data

      const student: IStudent | null =
        await this.studentsModel.findStudentByUserId(userId)
      completeStudent.student = student

      const academicFormations =
        await this.academicFormationsModel.findAcademicFormationsByPersonId(
          personId,
        )
      if (academicFormations.length > 0) {
        completeStudent.academicFormations = academicFormations
      }

      const languages = await this.languagesModel.findLanguagesByPersonId(
        personId,
      )
      if (languages.length > 0) {
        completeStudent.languages = languages
      }

      const courses = await this.coursesModel.findCoursesByPersonId(personId)
      if (courses.length > 0) {
        completeStudent.courses = courses
      }

      if (
        student != null &&
        (student.marital_status_type_name == 'Casado' ||
          student.marital_status_type_name == 'Noivo')
      ) {
        const spouse: ISpouse | null =
          await this.spousesModel.findSpouseByUserId(userId)
        completeStudent.spouse = spouse
        let spousePersonId
        if (spouse != null && spouse.spouse_id) {
          spousePersonId = spouse.person_id

          const spAcademicFormations =
            await this.academicFormationsModel.findAcademicFormationsByPersonId(
              spousePersonId,
            )
          if (spAcademicFormations.length > 0) {
            completeStudent.spAcademicFormations = spAcademicFormations
          }

          const spLanguages = await this.languagesModel.findLanguagesByPersonId(
            spousePersonId,
          )
          if (spLanguages.length > 0) {
            completeStudent.spLanguages = spLanguages
          }

          const spCourses = await this.coursesModel.findCoursesByPersonId(
            spousePersonId,
          )
          if (spCourses.length > 0) {
            completeStudent.spCourses = spCourses
          }
        }
      }
    } catch (error) {
      console.error(
        'Erro capturado no ApprovalsService findOneNotApproved:',
        error,
      )
    }
    return completeStudent
  }

  addPersonIds(
    personIds: number[],
    notApprovedIds: { person_id: number }[] | null,
  ) {
    if (notApprovedIds !== null) {
      notApprovedIds.forEach((id) => {
        if (!personIds.includes(id.person_id)) {
          personIds.push(id.person_id)
        }
      })
    }
    return personIds
  }

  async addPhotos(
    users: ICompleteUser[],
    photosInfo: {
      fileStream: fs.ReadStream | null
      headers: Record<string, string>
    }[],
  ) {
    for (let i = 0; i < users.length; i++) {
      if (photosInfo[i].fileStream != null) {
        const { fileStream, headers } = photosInfo[i]

        if (fileStream) {
          const filePromise = new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            fileStream.on('data', (chunk: Buffer) => {
              chunks.push(chunk)
            })
            fileStream.on('end', () => {
              const file = Buffer.concat(chunks)
              resolve(file)
            })
            fileStream.on('error', (error: Error) => {
              reject(error)
            })
          })

          const file = await filePromise
          console.log('filestream:', fileStream)
          console.log('file:', file)
          users[i].photo = {
            file,
            headers,
          }
        }
      } else {
        users[i].photo = null
      }
    }
  }
}

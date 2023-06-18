import { Injectable } from '@nestjs/common'
import { IApproveData, ICompleteStudent, ICompleteUser } from '../types/types'
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
import { ApprovalsModel } from '../model/approvals.model'

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
    private approvalsModel: ApprovalsModel
  ) {}

  async findNotApproved(): Promise<ICompleteUser[] | null> {
    let users: ICompleteUser[] | null = null
    try {
      let personIds: number[] = []

      const notApprovedStudentPersonIds =
        await this.studentsModel.findNotApprovedIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedStudentPersonIds)

      const notApprovedSpousesPersonIds =
        await this.academicFormationsModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedSpousesPersonIds)

      const notApprovedAcademicFormationsPersonIds =
        await this.spousesModel.findNotApprovedStudentIds()
      console.log(personIds)
        personIds = this.addPersonIds(
        personIds,
        notApprovedAcademicFormationsPersonIds,
      )

      const notApprovedLanguagesPersonIds =
        await this.languagesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedLanguagesPersonIds)

      const notApprovedCoursesPersonIds =
        await this.coursesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedCoursesPersonIds)

      const notApprovedPreviousMarriagesPersonIds =
        await this.previousMarriagesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(
        personIds,
        notApprovedPreviousMarriagesPersonIds,
      )

      const notApprovedProfessionalExpPersonIds =
        await this.professionalExperiencesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(
        personIds,
        notApprovedProfessionalExpPersonIds,
      )

      const notApprovedPasEclExpsPersonIds =
        await this.pastEclExpsModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedPasEclExpsPersonIds)

      const notApprovedEvangExpsPersonIds =
        await this.evangelisticExperiencesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedEvangExpsPersonIds)

      const notApprovedEclExpsPersonIds =
        await this.eclExperiencesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedEclExpsPersonIds)

      const notApprovedPublicationsPersonIds =
        await this.publicationsModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedPublicationsPersonIds)

      const notApprovedEndowmentsPersonIds =
        await this.endowmentsModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedEndowmentsPersonIds)

      const notApprovedOrdinationsPersonIds =
        await this.ordinationsModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(personIds, notApprovedOrdinationsPersonIds)

      const notApprovedRelatedMinistriesPersonIds =
        await this.relatedMinistriesModel.findAllNotApprovedPersonIds()
      console.log(personIds)
        personIds = this.addPersonIds(
        personIds,
        notApprovedRelatedMinistriesPersonIds,
      )

      const notApprovedChildrenPersonIds =
        await this.childrenService.findAllNotApprovedPersonIds()
      console.log(personIds)
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

  async findOneNotApproved(
    userId: number
  ): Promise<ICompleteStudent> {
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
    }

    try {
      let studentId: number = 0
      
      const student: IStudent | null =
        await this.studentsModel.findStudentByUserId(userId)
      completeStudent.student = student

      let personId:number = 0

      if(student != null){
        personId = student.person_id
      }

      let user: IUser | null = await this.usersModel.findUserById(userId)
      completeStudent.user = user
      

      if (student && student.student_id) {
        studentId = student.student_id
      }

      if (personId > 0){
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

        const professionalExperiences =
          await this.professionalExperiencesModel.findProfessionalExperiencesByPersonId(
            personId,
          )
        if (professionalExperiences.length > 0) {
          completeStudent.professionalExperiences = professionalExperiences
        }

        const pastEclExps = await this.pastEclExpsModel.findPastEclExpsByPersonId(
          personId,
        )
        if (pastEclExps.length > 0) {
          completeStudent.pastEclExps = pastEclExps
        }

        const evangelisticExperiences =
          await this.evangelisticExperiencesModel.findEvangelisticExperiencesByPersonId(
            personId,
          )
        if (evangelisticExperiences.length > 0) {
          completeStudent.evangelisticExperiences = evangelisticExperiences
        }

        const eclExperiences =
          await this.eclExperiencesModel.findEclExperiencesByPersonId(personId)
        if (eclExperiences.length > 0) {
          completeStudent.eclExperiences = eclExperiences
        }

        const publications =
          await this.publicationsModel.findPublicationsByPersonId(personId)
        if (publications.length > 0) {
          completeStudent.publications = publications
        }

        const endowments = await this.endowmentsModel.findEndowmentsByPersonId(
          personId,
        )
        if (endowments.length > 0) {
          completeStudent.endowments = endowments
        }

        const ordinations = await this.ordinationsModel.findOrdinationsByPersonId(
          personId,
        )
        if (ordinations.length > 0) {
          completeStudent.ordinations = ordinations
        }

        const relatedMinistries =
          await this.relatedMinistriesModel.findRelatedMinistriesByPersonId(
            personId,
          )
        if (relatedMinistries.length > 0) {
          completeStudent.relatedMinistries = relatedMinistries
        }
      }

      

      if (studentId > 0) {
        if (
          student?.marital_status_type_name == 'Divorciado' ||
          student?.marital_status_type_name == 'Viúvo'
        ) {
          const previousMarriage =
            await this.previousMarriagesModel.findPreviousMarriagesByStudentId(
              studentId,
            )
          if (previousMarriage.length > 0) {
            completeStudent.previousMarriage = previousMarriage
          }
        }

        const children = await this.childrenService.findChildrenByStudentId(
          studentId,
        )
        if (children.length > 0) {
          completeStudent.children = children
        }
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

          const spProfessionalExperiences =
            await this.professionalExperiencesModel.findProfessionalExperiencesByPersonId(
              spousePersonId,
            )
          if (spProfessionalExperiences.length > 0) {
            completeStudent.spProfessionalExperiences =
              spProfessionalExperiences
          }

          const spPastEclExps =
            await this.pastEclExpsModel.findPastEclExpsByPersonId(
              spousePersonId,
            )
          if (spPastEclExps.length > 0) {
            completeStudent.spPastEclExps = spPastEclExps
          }

          const spEvangelisticExperiences =
            await this.evangelisticExperiencesModel.findEvangelisticExperiencesByPersonId(
              spousePersonId,
            )
          if (spEvangelisticExperiences.length > 0) {
            completeStudent.spEvangelisticExperiences =
              spEvangelisticExperiences
          }

          const spPublications =
            await this.publicationsModel.findPublicationsByPersonId(
              spousePersonId,
            )
          if (spPublications.length > 0) {
            completeStudent.spPublications = spPublications
          }

          const spEndowments =
            await this.endowmentsModel.findEndowmentsByPersonId(spousePersonId)
          if (spEndowments.length > 0) {
            completeStudent.spEndowments = spEndowments
          }

          const spRelatedMinistries =
            await this.relatedMinistriesModel.findRelatedMinistriesByPersonId(
              spousePersonId,
            )
          if (spRelatedMinistries.length > 0) {
            completeStudent.spRelatedMinistries = spRelatedMinistries
          }
        }
      }

      await this.createPhotoFile(userId, completeStudent, 'small-alone-photo')
      await this.createPhotoFile(userId, completeStudent, 'alone-photo')
      await this.createPhotoFile(userId, completeStudent, 'family-photo')
      await this.createPhotoFile(userId, completeStudent, 'other-family-photo')
      await this.createPhotoFile(userId, completeStudent, 'spouse-photo')
      await this.createPhotoFile(userId, completeStudent, 'invite-photo')
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

  async addPhotoToStudent(photoData: {
    fileStream: fs.ReadStream | null
    headers: Record<string, string>
  }): Promise<{
    file: Buffer
    headers: Record<string, string>
  } | null> {
    let photo: {
      file: Buffer 
      headers: Record<string, string>
    } | null = null
    if (photoData.fileStream != null) {
      const { fileStream, headers } = photoData

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

        photo = {
          file,
          headers,
        }
      }
    }
    return photo
  }

  async createPhotoFile(
    userId: number,
    completeStudent: ICompleteStudent,
    photoType: string,
  ) {
    let correctPhotoType = photoType.replace(/-/g, '_')
    let photoData: {
      fileStream: fs.ReadStream | null
      headers: Record<string, string>
    }
    photoData = await this.studentPhotoService.findStudentPhotoByStudentId(
      userId,
      photoType,
    )
    completeStudent.photos[correctPhotoType] = await this.addPhotoToStudent(
      photoData,
    )
  }

  async approveAny( data:IApproveData ):Promise<boolean>{
    let approved: boolean | null = null
    try {
      data.id = parseInt(data.id.toString())
      const approved = await this.approvalsModel.approveAny(data)
      return approved
    } catch (error) {
      console.error(`Erro capturado no ApprovalsService approve any: ${error}`)
      
    }
    if(approved === null){
      throw new Error('Não foi possível executar a aprovação')
    }
    return approved

  }
}

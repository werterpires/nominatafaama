import { Injectable } from '@nestjs/common'
import { ICompleteStudent } from '../types/types'
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
  ) {}

  async findNotApproved(): Promise<IUser[] | null> {
    let users: IUser[] | null = null
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

      const result = await this.usersModel.findUsersByIds(personIds)
      if (result !== null) {
        users = result
      }
    } catch (error) {
      console.error('Erro capturado no service: ', error)
      throw error
    }
    return users
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
}

import { Injectable } from '@nestjs/common'
import { ICompleteStudent } from '../types/types'
import { IUser } from 'src/modules/users/bz_types/types'
import { StudentsModel } from 'src/modules/students/model/students.model'
import { UsersModel } from 'src/modules/users/ez_model/users.model'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { AcademicFormationsModel } from 'src/modules/info/academic-formations/model/academic-formations.model'
import { LanguagesModel } from 'src/modules/info/languages/model/languages.model'

@Injectable()
export class ApprovalsService {
  constructor(
    private studentsModel: StudentsModel,
    private usersModel: UsersModel,
    private spousesModel: SpousesModel,
    private academicFormationsModel: AcademicFormationsModel,
    private languagesModel: LanguagesModel,
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

      const notApprovedLanguagePersonIds =
        await this.languagesModel.findAllNotApprovedPersonIds()
      personIds = this.addPersonIds(personIds, notApprovedLanguagePersonIds)

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

import { Injectable } from '@nestjs/common'
import { ICompleteStudent } from '../types/types'
import { IUser } from 'src/modules/users/bz_types/types'
import { StudentsModel } from 'src/modules/students/model/students.model'
import { UsersModel } from 'src/modules/users/ez_model/users.model'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'

@Injectable()
export class ApprovalsService {
  constructor(
    private studentsModel: StudentsModel,
    private usersModel: UsersModel,
    private spousesModel: SpousesModel,
  ) {}

  async findNotApproved(): Promise<IUser[] | null> {
    let users: IUser[] | null = null
    try {
      let personIds: number[] = []

      const notApprovedStudentPersonIds =
        await this.studentsModel.findNotApprovedIds()
      if (notApprovedStudentPersonIds !== null) {
        notApprovedStudentPersonIds.forEach((student) => {
          if (!personIds.includes(student.person_id)) {
            personIds.push(student.person_id)
          }
        })
      }

      const notApprovedSpousesPersonIds =
        await this.spousesModel.findNotApprovedStudentIds()
      console.log(notApprovedSpousesPersonIds)
      if (notApprovedSpousesPersonIds !== null) {
        notApprovedSpousesPersonIds.forEach((spouse) => {
          if (!personIds.includes(spouse.person_id)) {
            personIds.push(spouse.person_id)
          }
        })
      }

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
}

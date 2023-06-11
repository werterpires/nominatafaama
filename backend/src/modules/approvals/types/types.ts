import { IStudent } from 'src/modules/students/types/types'
import { IUser } from 'src/modules/users/bz_types/types'

export interface ICompleteStudent {
  student: IStudent
}

export interface ICompleteUser extends IUser {
  photo?: { file: Buffer; headers: Record<string, string> } | null
}

import { IAcademicFormation } from 'src/modules/info/academic-formations/types/types'
import { ISpouse } from 'src/modules/spouses/types/types'
import { IStudent } from 'src/modules/students/types/types'
import { IUser } from 'src/modules/users/bz_types/types'

export interface ICompleteStudent {
  student: IStudent | null
  spouse: ISpouse | null
  academicFormations: IAcademicFormation[] | null
  spAcademicFormations: IAcademicFormation[] | null
}

export interface ICompleteUser extends IUser {
  photo?: { file: Buffer; headers: Record<string, string> } | null
}

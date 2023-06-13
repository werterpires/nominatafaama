import { IAcademicFormation } from 'src/modules/info/academic-formations/types/types'
import { ICourse } from 'src/modules/info/courses/types/types'
import { IEvangelisticExperience } from 'src/modules/info/evangelistic-experiences/types/types'
import { ILanguage } from 'src/modules/info/languages/types/types'
import { IPastEclExp } from 'src/modules/info/past-ecl-experiences/types/types'
import { IPreviousMarriage } from 'src/modules/info/previous-marriage/types/types'
import { IProfessionalExperience } from 'src/modules/info/professional-experiences/types/types'
import { ISpouse } from 'src/modules/spouses/types/types'
import { IStudent } from 'src/modules/students/types/types'
import { IUser } from 'src/modules/users/bz_types/types'

export interface ICompleteStudent {
  student: IStudent | null
  spouse: ISpouse | null
  previousMarriage: IPreviousMarriage[] | null
  academicFormations: IAcademicFormation[] | null
  spAcademicFormations: IAcademicFormation[] | null
  languages: ILanguage[] | null
  spLanguages: ILanguage[] | null
  courses: ICourse[] | null
  spCourses: ICourse[] | null
  professionalExperiences: IProfessionalExperience[] | null
  spProfessionalExperiences: IProfessionalExperience[] | null
  pastEclExps: IPastEclExp[] | null
  spPastEclExps: IPastEclExp[] | null
  evangelisticExperiences: IEvangelisticExperience[] | null
  spEvangelisticExperiences: IEvangelisticExperience[] | null
}

export interface ICompleteUser extends IUser {
  photo?: { file: Buffer; headers: Record<string, string> } | null
}

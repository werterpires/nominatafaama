import { SafeResourceUrl } from '@angular/platform-browser'
import { IUser } from '../../shared/container/types'
import { IChild } from '../../records/children/types'
import { IEclExperience } from '../../records/ecl-experiences/types'
import { IEndowment } from '../../records/endowments/types'
import { IEvangelisticExperience } from '../../records/evg-experiences/types'
import { ILanguage } from '../../records/languages/types'
import { IOrdination } from '../../records/ordinations/types'
import { IPastEclExp } from '../../records/past-ecl-exps/types'
import { IPreviousMarriage } from '../../records/previous-marriage/types'
import { IProfessionalExperience } from '../../records/professional-experiences/types'
import { IPublication } from '../../records/publications/types'
import { IRelatedMinistry } from '../../records/related-ministries/types'
import { ISpouse } from '../../records/spouses/types'
import { ICourse } from '../../records/st-courses/types'
import { IStudent } from '../../records/students/types'
import { IStAcademicFormation } from '../../records/student-academic-formations/types'

export interface ICompleteUser extends IUser {
  photo: { file: any; headers: Record<string, string> } | null
  imageUrl?: SafeResourceUrl
}

export interface ICompleteStudent {
  student: IStudent | null
  spouse: ISpouse | null
  previousMarriage: IPreviousMarriage[] | null
  eclExperiences: IEclExperience[] | null
  ordinations: IOrdination[] | null
  children: IChild[] | null
  academicFormations: IStAcademicFormation[] | null
  spAcademicFormations: IStAcademicFormation[] | null
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
  publications: IPublication[] | null
  spPublications: IPublication[] | null
  endowments: IEndowment[] | null
  spEndowments: IEndowment[] | null
  relatedMinistries: IRelatedMinistry[] | null
  spRelatedMinistries: IRelatedMinistry[] | null
  photos: IPhotoFile | null
  user: IUser | null
}

export interface IPhotoFile {
  alone_photo: { file: any; headers: Record<string, string> } | null
  family_photo: { file: any; headers: Record<string, string> } | null
  other_family_photo: { file: any; headers: Record<string, string> } | null
  spouse_photo: { file: any; headers: Record<string, string> } | null
  invite_photo: { file: any; headers: Record<string, string> } | null
  small_alone_photo: { file: any; headers: Record<string, string> } | null
}

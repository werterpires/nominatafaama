import { SafeResourceUrl } from '@angular/platform-browser'
import { IUser } from '../../shared/container/types'

export interface ICompleteUser extends IUser {
  photo: { file: any; headers: Record<string, string> } | null
  imageUrl?: SafeResourceUrl
}

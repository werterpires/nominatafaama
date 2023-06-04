export interface IStudentPhoto {
  photo_pack_id: number
  alone_photo: string
  family_photo: string
  other_family_photo: string
  spouse_photo: string
  invite_photo: string
  small_alone_photo: string
  student_id: number
  created_at: Date
  updated_at: Date
}

export interface ICreateStudentPhoto {
  alone_photo: string | null
  family_photo: string | null
  other_family_photo: string | null
  spouse_photo: string | null
  invite_photo: string | null
  small_alone_photo: string | null
  student_id: number
}

export interface IUpdateStudentPhoto {
  photo_pack_id: number
  alone_photo: string
  family_photo: string
  other_family_photo: string
  spouse_photo: string
  invite_photo: string
  small_alone_photo: string
  student_id: number
}

export interface IOnePhotoAddress {
  address: string
}

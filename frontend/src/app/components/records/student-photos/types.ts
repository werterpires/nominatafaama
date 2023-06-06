export interface IStudentPhoto {
  photo_pack_id: number
  alone_photo: string
  family_photo: string
  other_family_photo: string
  spouse_photo: string
  invite_photo: string
  student_id: number
  created_at: Date
  updated_at: Date
}

export interface CreateStudentPhotoDto {
  file: File
}

export interface receiveStudentPhoto {
  file: File
}

export interface UpdateStudentPhotoDto {
  photo_pack_id: number
  alone_photo: string
  family_photo: string
  other_family_photo: string
  spouse_photo: string
  invite_photo: string
  student_id: number
}

export interface AddressNull {
  address: null
}

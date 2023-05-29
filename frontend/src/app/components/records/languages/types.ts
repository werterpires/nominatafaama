export interface ILanguage {
  language_id: number
  chosen_language: number
  read: boolean
  understand: boolean
  speak: boolean
  write: boolean
  fluent: boolean
  unknown: boolean
  person_id: number
  language: string
  language_approved: boolean | null
  created_at: string
  updated_at: string
}

export interface IUpdateLanguageDto {
  language_id: number
  chosen_language: number
  read: boolean
  understand: boolean
  speak: boolean
  write: boolean
  fluent: boolean
  unknown: boolean
  person_id: number
}

export interface ICreateLanguageDto {
  chosen_language: number
  read: boolean
  understand: boolean
  speak: boolean
  write: boolean
  fluent: boolean
  unknown: boolean
}

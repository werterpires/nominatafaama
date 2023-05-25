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
  language_approved: boolean | null
  language: string
  created_at: Date
  updated_at: Date
}

export interface ICreateLanguage {
  chosen_language: number
  read: boolean
  understand: boolean
  speak: boolean
  write: boolean
  fluent: boolean
  unknown: boolean
  person_id: number
  language_approved: boolean | null
}

export interface IUpdateLanguage {
  language_id: number
  chosen_language: number
  read: boolean
  understand: boolean
  speak: boolean
  write: boolean
  fluent: boolean
  unknown: boolean
  person_id: number
  language_approved: boolean | null
}

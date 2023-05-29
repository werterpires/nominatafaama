export interface ILanguageType {
  language_id: number
  language: string
  created_at: string
  updated_at: string
}

export interface ICreateLanguageTypeDto {
  language: string
}

export interface IUpdateLanguageType {
  language_id: number
  language: string
}

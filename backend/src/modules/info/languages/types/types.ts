export interface ILanguage {
    language_id: number;
    chosen_language: number;
    read: boolean;
    understand: boolean;
    speak: boolean;
    write: boolean;
    fluent: boolean;
    unknown: boolean;
    person_id: number;
    language_approved: boolean;
    created_at: Date;
    updated_at: Date;
  }

  export interface ICreateLanguage {
    chosen_language: number;
    read: boolean;
    understand: boolean;
    speak: boolean;
    write: boolean;
    fluent: boolean;
    unknown: boolean;
    person_id: number;
    language_approved: boolean;
  }

  export interface IUpdateLanguage {
    chosen_language: number;
    read: boolean;
    understand: boolean;
    speak: boolean;
    write: boolean;
    fluent: boolean;
    unknown: boolean;
    person_id: number;
    language_approved: boolean;
    language_id: number;
  }
  

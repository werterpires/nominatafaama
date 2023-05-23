export interface ILanguageType {
    language_id: number;
    language: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateLanguageType {
    language: string;
}

export interface IUpdateLanguageType {
    language: string;
    language_id: number;
}

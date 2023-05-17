export interface IUnion {
    union_id: number;
    union_name: string;
    union_acronym: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateUnion {
    union_name: string;
    union_acronym: string;
  }
  
  export interface IUpdateUnion {
    union_name: string;
    union_acronym: string;
    union_id: number;
  }
  
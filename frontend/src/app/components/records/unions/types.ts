export interface IUnion {
    union_id: number;
    union_name: string;
    union_acronym: string;
  }
  
  export interface CreateUnionDto {
    union_name: string;
    union_acronym: string;
  }
  
  export interface UpdateUnionDto {
    union_name: string;
    union_acronym: string;
    union_id: number;
  } 
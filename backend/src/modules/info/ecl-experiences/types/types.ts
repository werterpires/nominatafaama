export interface IEclExperience {
    ecl_exp_id: number;
    person_id: number;
    ecl_exp_type_id: number;
    ecl_exp_approved: boolean | null;
    ecl_exp_type_name: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateEclExperience {
    person_id: number;
    ecl_exp_type_id: number;
    ecl_exp_approved:boolean | null
  }

  export interface IUpdateEclExperience {
    ecl_exp_id: number;
    ecl_exp_type_id: number;
  }
  
  export interface IUpdateEclExperiences {
    person_id: number;
    ecl_exp_type_ids: number[];

  }
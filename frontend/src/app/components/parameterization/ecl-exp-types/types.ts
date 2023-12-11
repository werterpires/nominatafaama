export interface IEclExpType {
  ecl_exp_type_id: number
  ecl_exp_type_name: string
  created_at: string
  updated_at: string
}

export interface ICreateEclExpTypeDto {
  ecl_exp_type_name: string
}

export interface IUpdateEclExpType {
  ecl_exp_type_id: number
  ecl_exp_type_name: string
}

export interface IEclExperienceList extends IEclExpType {
  checked: boolean
  approved?: boolean | null
  ecl_exp_id?: number | null
}

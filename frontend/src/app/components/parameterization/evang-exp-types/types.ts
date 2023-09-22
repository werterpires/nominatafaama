export interface IEvangExpType {
  evang_exp_type_id: number
  evang_exp_type_name: string
  created_at: string
  updated_at: string
}

export interface ICreateEvangExpTypeDto {
  evang_exp_type_name: string
}

export interface IUpdateEvangExpType {
  evang_exp_type_id: number
  evang_exp_type_name: string
}

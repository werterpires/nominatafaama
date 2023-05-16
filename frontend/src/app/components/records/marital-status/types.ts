export interface IMaritalStatus {
  marital_status_type_id: number,
  marital_status_type_name: string

}

export interface CreateMaritalStatusDto {

  marital_status_type_name: string;
}

export interface IUpdateMaritalStatus {
  marital_status_type_name: string;
  marital_status_type_id: number
}
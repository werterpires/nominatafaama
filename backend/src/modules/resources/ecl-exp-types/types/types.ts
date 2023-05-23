export interface IEclExpType {
    ecl_exp_type_id: number;
    ecl_exp_type_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateEclExpType {
    ecl_exp_type_name: string;
}

export interface IUpdateEclExpType {
    ecl_exp_type_name: string;
    ecl_exp_type_id: number;
}

export interface IEvangExpType {
    evang_exp_type_id: number;
    evang_exp_type_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateEvangExpType {
    evang_exp_type_name: string;
}

export interface IUpdateEvangExpType {
    evang_exp_type_name: string;
    evang_exp_type_id: number;
}

import { ItermUser } from 'src/modules/users/bz_types/types';
import { ITerm } from '../types/types';
import { IsArray } from 'class-validator';

export class CreateTermDto {}
export class CreateSignatureDto {
  @IsArray()
  termsUser: ItermUser[];
}

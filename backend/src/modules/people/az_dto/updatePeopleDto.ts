//Tipo de dado esperado da API

import {
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';

export class UpdatePersonDto {

  @IsNotEmpty()
  id: number

  @MinLength(2)
  name: string;

  @Length(11)
  cpf: string;
}

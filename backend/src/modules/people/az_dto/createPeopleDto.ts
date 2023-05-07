//Tipo de dado esperado da API

import {
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Length(11)
  cpf: string;
}

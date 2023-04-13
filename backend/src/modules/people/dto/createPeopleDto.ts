import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/addresses/dto/createAddressDto';

export class CreatePersonDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  surname: string;

  @ValidateIf((d) => d.email !== null)
  @IsEmail()
  email: string | null;

  @Length(11)
  cpf: string | null;

  @ValidateIf((d) => d.addressId !== null)
  @IsNumber()
  addressId: number | null;

  @ValidateIf((d)=>d.address !== null)
  address: CreateAddressDto | null;
}

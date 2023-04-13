import { Allow, IsNotEmpty } from 'class-validator';

// Classe de DTO (Data Transfer Object) para a criação de um endereço
export class CreateAddressDto {
  // A propriedade "street" (Rua) é obrigatória
  @IsNotEmpty()
  street: string;

  // A propriedade "number" (Número) é obrigatória
  @IsNotEmpty()
  number: string;

  // A propriedade "complement" (Complemento) é opcional
  @Allow()
  complement: string | null;

  // A propriedade "neighborhood" (Bairro) é obrigatória
  @IsNotEmpty()
  neighborhood: string;

  // A propriedade "city" (Cidade) é obrigatória
  @IsNotEmpty()
  city: string;

  // A propriedade "state" (Estado) é obrigatória
  @IsNotEmpty()
  state: string;

  // A propriedade "referencePoint" (Ponto de referência) é opcional
  @Allow()
  referencePoint: string | null;

  // A propriedade "zipCode" (CEP) é obrigatória
  @IsNotEmpty()
  zipCode: string;

  // A propriedade "mailbox" (Caixa postal) é opcional
  @Allow()
  mailbox: string | null;
}

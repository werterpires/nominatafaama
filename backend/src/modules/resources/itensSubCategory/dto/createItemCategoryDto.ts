import { Allow, IsNotEmpty, IsNumber } from 'class-validator';

// Classe de DTO (Data Transfer Object) para a criação de um endereço
export class CreateItemSubCategoryDto {
  @IsNotEmpty()
  subCategoryName: string;

  @IsNotEmpty()
  subCategoryDescription: string;

  @IsNumber()
  categoryId: number;
}

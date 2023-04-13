import { Allow, IsNotEmpty } from 'class-validator';

// Classe de DTO (Data Transfer Object) para a criação de um endereço
export class CreateItemCategoryDto {
  @IsNotEmpty()
  categoryName: string;

  @IsNotEmpty()
  categoryDescription: string;
}

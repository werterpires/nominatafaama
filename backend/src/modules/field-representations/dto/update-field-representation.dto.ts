import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldRepresentationDto } from './create-field-representation.dto';

export class UpdateFieldRepresentationDto extends PartialType(CreateFieldRepresentationDto) {}

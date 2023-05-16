import { PartialType } from '@nestjs/mapped-types';
import { CreateUnionDto } from './create-union.dto';

export class UpdateUnionDto extends PartialType(CreateUnionDto) {}

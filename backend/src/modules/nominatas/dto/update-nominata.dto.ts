import { PartialType } from '@nestjs/mapped-types';
import { CreateNominataDto } from './create-nominata.dto';

export class UpdateNominataDto extends PartialType(CreateNominataDto) {}

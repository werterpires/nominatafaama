import { PartialType } from '@nestjs/mapped-types';
import { CreateHiringStatusDto } from './create-hiring-status.dto';

export class UpdateHiringStatusDto extends PartialType(CreateHiringStatusDto) {}

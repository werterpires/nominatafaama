import { PartialType } from '@nestjs/mapped-types';
import { CreateNominataPhotoDto } from './create-nominata-photo.dto';

export class UpdateNominataPhotoDto extends PartialType(CreateNominataPhotoDto) {}

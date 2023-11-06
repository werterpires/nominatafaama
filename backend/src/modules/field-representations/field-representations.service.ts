import { Injectable } from '@nestjs/common';
import { CreateFieldRepresentationDto } from './dto/create-field-representation.dto';
import { UpdateFieldRepresentationDto } from './dto/update-field-representation.dto';

@Injectable()
export class FieldRepresentationsService {
  create(createFieldRepresentationDto: CreateFieldRepresentationDto) {
    return 'This action adds a new fieldRepresentation';
  }

  findAll() {
    return `This action returns all fieldRepresentations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldRepresentation`;
  }

  update(id: number, updateFieldRepresentationDto: UpdateFieldRepresentationDto) {
    return `This action updates a #${id} fieldRepresentation`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldRepresentation`;
  }
}

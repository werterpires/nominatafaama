import { Injectable } from '@nestjs/common';
import { CreateFieldRepDto } from './dto/create-field-rep.dto';
import { UpdateFieldRepDto } from './dto/update-field-rep.dto';

@Injectable()
export class FieldRepsService {
  create(createFieldRepDto: CreateFieldRepDto) {
    return 'This action adds a new fieldRep';
  }

  findAll() {
    return `This action returns all fieldReps`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldRep`;
  }

  update(id: number, updateFieldRepDto: UpdateFieldRepDto) {
    return `This action updates a #${id} fieldRep`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldRep`;
  }
}

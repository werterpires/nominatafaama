import { Injectable } from '@nestjs/common';
import { CreateUnionDto } from './dto/create-union.dto';
import { UpdateUnionDto } from './dto/update-union.dto';

@Injectable()
export class UnionsService {
  create(createUnionDto: CreateUnionDto) {
    return 'This action adds a new union';
  }

  findAll() {
    return `This action returns all unions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} union`;
  }

  update(id: number, updateUnionDto: UpdateUnionDto) {
    return `This action updates a #${id} union`;
  }

  remove(id: number) {
    return `This action removes a #${id} union`;
  }
}

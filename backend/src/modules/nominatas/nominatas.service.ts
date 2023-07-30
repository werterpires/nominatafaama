import { Injectable } from '@nestjs/common';
import { CreateNominataDto } from './dto/create-nominata.dto';
import { UpdateNominataDto } from './dto/update-nominata.dto';

@Injectable()
export class NominatasService {
  create(createNominataDto: CreateNominataDto) {
    return 'This action adds a new nominata';
  }

  findAll() {
    return `This action returns all nominatas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nominata`;
  }

  update(id: number, updateNominataDto: UpdateNominataDto) {
    return `This action updates a #${id} nominata`;
  }

  remove(id: number) {
    return `This action removes a #${id} nominata`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateHiringStatusDto } from './dto/create-hiring-status.dto';
import { UpdateHiringStatusDto } from './dto/update-hiring-status.dto';

@Injectable()
export class HiringStatusService {
  create(createHiringStatusDto: CreateHiringStatusDto) {
    return 'This action adds a new hiringStatus';
  }

  findAll() {
    return `This action returns all hiringStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hiringStatus`;
  }

  update(id: number, updateHiringStatusDto: UpdateHiringStatusDto) {
    return `This action updates a #${id} hiringStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} hiringStatus`;
  }
}

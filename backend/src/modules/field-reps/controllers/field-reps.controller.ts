import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { FieldRepsService } from '../field-reps.service'
import { CreateFieldRepDto } from '../dto/create-field-rep.dto'
import { UpdateFieldRepDto } from '../dto/update-field-rep.dto'

@Controller('field-reps')
export class FieldRepsController {
  constructor(private readonly fieldRepsService: FieldRepsService) {}

  @Post()
  create(@Body() createFieldRepDto: CreateFieldRepDto) {
    return this.fieldRepsService.create(createFieldRepDto)
  }

  @Get()
  findAll() {
    return this.fieldRepsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldRepsService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFieldRepDto: UpdateFieldRepDto
  ) {
    return this.fieldRepsService.update(+id, updateFieldRepDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldRepsService.remove(+id)
  }
}

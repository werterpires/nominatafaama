import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { SendEmailService } from './send-email.service'
import { CreateSendEmailDto } from './dto/create-send-email.dto'
import { UpdateSendEmailDto } from './dto/update-send-email.dto'

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Get()
  findAll() {
    return this.sendEmailService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendEmailService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSendEmailDto: UpdateSendEmailDto
  ) {
    return this.sendEmailService.update(+id, updateSendEmailDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendEmailService.remove(+id)
  }
}

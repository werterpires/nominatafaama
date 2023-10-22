import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { IEvent } from '../types/types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO, ERoles.DESIGN)
  @Post()
  async createEvent(@Body() input: CreateEventDto) {
    try {
      const event = await this.eventsService.createEvent(input);
      return event;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO, ERoles.DESIGN)
  @Get(':nominataId')
  async findAllEventsByNominataId(@Param('nominataId') nominataId: string) {
    try {
      const events = await this.eventsService.findAllEventsByNominataId(
        parseInt(nominataId.toString())
      );
      return events;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO, ERoles.DESIGN)
  @Put()
  async updateEvent(@Body() updateEventDto: UpdateEventDto) {
    try {
      await this.eventsService.updateEventById(updateEventDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO, ERoles.DESIGN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return { response: await this.eventsService.remove(+id) };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

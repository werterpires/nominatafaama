import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { CreateSpouseDto } from '../dto/create-spouse.dto';
import { UpdateSpouseDto } from '../dto/update-spouse.dto';
import { SpousesService } from '../services/spouses.service';
import { ISpouse } from '../types/types';

@Controller('spouses')
export class SpousesController {
  constructor(private spousesService: SpousesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createSpouse(
    @Body() input: CreateSpouseDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    const id = user.user_id;
    try {
      const spouse = await this.spousesService.createSpouse(input, id);
      return spouse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('edit')
  async findSpouseById(@CurrentUser() user: UserFromJwt): Promise<ISpouse> {
    const id = user.user_id;
    try {
      const spouse = await this.spousesService.findSpouseByUserId(id);
      return spouse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateSpouse(
    @Body() input: UpdateSpouseDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      const id = user.user_id;
      const updatedSpouse = await this.spousesService.updateSpouseById(
        input,
        id,
      );
      return updatedSpouse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteSpouseById(@Param('id') id: number) {
    try {
      const message = await this.spousesService.deleteSpouseById(id);
      return {message};
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

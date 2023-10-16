import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { TermsService } from '../services/terms.service';
import { CreateSignatureDto, CreateTermDto } from '../dto/create-term.dto';
import { UpdateTermDto } from '../dto/update-term.dto';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { IUser } from 'src/modules/users/bz_types/types';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Post('sign')
  create(
    @Body() signatureDto: CreateSignatureDto,
    @CurrentUser() currentUser: IUser
  ) {
    try {
      const { user_id } = currentUser;
      return this.termsService.create(signatureDto, user_id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @IsPublic()
  @Get('active')
  async findAllActiveTerms() {
    try {
      const terms = await this.termsService.findAllActiveTerms();
      return terms;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTermDto: UpdateTermDto) {
    return this.termsService.update(+id, updateTermDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.termsService.remove(+id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSignatureDto, CreateTermDto } from '../dto/create-term.dto';
import { UpdateTermDto } from '../dto/update-term.dto';
import { ITerm } from '../types/types';
import { TermsModel } from '../model/terms.model';

@Injectable()
export class TermsService {
  constructor(private termsModel: TermsModel) {}
  create(createSignatureDto: CreateSignatureDto, userId: number) {
    try {
      const roles = createSignatureDto.termsUser.map((role) => role.role_id);
      return this.termsModel.signTerms(roles, userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllActiveTerms(): Promise<ITerm[]> {
    let terms: ITerm[] = [];
    try {
      terms = await this.termsModel.findAllActiveTerms();
    } catch (error) {}
    return terms;
  }

  findOne(id: number) {
    return `This action returns a #${id} term`;
  }

  update(id: number, updateTermDto: UpdateTermDto) {
    return `This action updates a #${id} term`;
  }

  remove(id: number) {
    return `This action removes a #${id} term`;
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateApprovalDto } from './create-approval.dto';

export class UpdateApprovalDto extends PartialType(CreateApprovalDto) {}

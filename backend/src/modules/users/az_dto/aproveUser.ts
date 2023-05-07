import { IsBoolean, IsNotEmpty } from "class-validator";

export class ApproveUserDto {
  @IsNotEmpty()
  userId: number;

  @IsBoolean()
  isApproved: boolean;
}


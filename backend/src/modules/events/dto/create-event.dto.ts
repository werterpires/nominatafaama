import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  event_date: string

  @IsNotEmpty()
  @IsString()
  event_time: string

  @IsString()
  @Length(1, 255)
  event_place: string

  @IsString()
  @Length(1, 255)
  event_title: string

  @IsString()
  @Length(1, 255)
  event_address: string

  @IsNumber()
  nominata_id: number
}

import { PartialType } from '@nestjs/mapped-types'
import { CreateEventDto } from './create-event.dto'
import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator'

export class UpdateEventDto extends PartialType(CreateEventDto) {
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

  @IsNumber()
  event_id: number
}

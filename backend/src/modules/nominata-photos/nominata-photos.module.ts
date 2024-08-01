import { Module } from '@nestjs/common';
import { NominataPhotosService } from './nominata-photos.service';
import { NominataPhotosController } from './nominata-photos.controller';

@Module({
  controllers: [NominataPhotosController],
  providers: [NominataPhotosService]
})
export class NominataPhotosModule {}

import { Module } from '@nestjs/common'
import { NominatasService } from './services/nominatas.service'
import { NominatasController } from './controllers/nominatas.controller'
import { NominatasModel } from './model/nominatas.model'

const services = [NominatasService, NominatasModel]

@Module({
  controllers: [NominatasController],
  providers: services,
  exports: services,
})
export class NominatasModule {}

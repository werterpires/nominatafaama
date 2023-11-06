import { Module } from '@nestjs/common'
import { FieldRepsService } from './field-reps.service'
import { FieldRepsController } from './controllers/field-reps.controller'

@Module({
  controllers: [FieldRepsController],
  providers: [FieldRepsService]
})
export class FieldRepsModule {}

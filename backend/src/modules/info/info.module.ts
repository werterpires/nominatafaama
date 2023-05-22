import { Module } from '@nestjs/common';
import { AcademicFormationsModule } from './academic-formations/academic-formations.module';

@Module({
  imports: [AcademicFormationsModule]
})
export class InfoModule {}

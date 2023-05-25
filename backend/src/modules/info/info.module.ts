import { Module } from '@nestjs/common';
import { AcademicFormationsModule } from './academic-formations/academic-formations.module';
import { LanguagesModule } from './languages/languages.module';
import { EvangelisticExperiencesModule } from './evangelistic-experiences/evangelistic-experiences.module';
import { EclExperiencesModule } from './ecl-experiences/ecl-experiences.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [AcademicFormationsModule, LanguagesModule, EvangelisticExperiencesModule, EclExperiencesModule, CoursesModule]
})
export class InfoModule {}

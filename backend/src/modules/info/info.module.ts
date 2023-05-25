import { Module } from '@nestjs/common';
import { AcademicFormationsModule } from './academic-formations/academic-formations.module';
import { LanguagesModule } from './languages/languages.module';
import { EvangelisticExperiencesModule } from './evangelistic-experiences/evangelistic-experiences.module';
import { EclExperiencesModule } from './ecl-experiences/ecl-experiences.module';
import { CoursesModule } from './courses/courses.module';
import { PreviousMarriageModule } from './previous-marriage/previous-marriage.module';

@Module({
  imports: [AcademicFormationsModule, LanguagesModule, EvangelisticExperiencesModule, EclExperiencesModule, CoursesModule, PreviousMarriageModule]
})
export class InfoModule {}

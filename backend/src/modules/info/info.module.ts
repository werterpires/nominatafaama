import { Module } from '@nestjs/common';
import { AcademicFormationsModule } from './academic-formations/academic-formations.module';
import { LanguagesModule } from './languages/languages.module';
import { EvangelisticExperiencesModule } from './evangelistic-experiences/evangelistic-experiences.module';
import { EclExperiencesModule } from './ecl-experiences/ecl-experiences.module';
import { CoursesModule } from './courses/courses.module';
import { PreviousMarriageModule } from './previous-marriage/previous-marriage.module';
import { ProfessionalExperiencesModule } from './professional-experiences/professional-experiences.module';
import { PastEclExperiencesModule } from './past-ecl-experiences/past-ecl-experiences.module';
import { PublicationsModule } from './publications/publications.module';
import { EndowmentsModule } from './endowments/endowments.module';
import { OrdinationsModule } from './ordinations/ordinations.module';

@Module({
  imports: [AcademicFormationsModule, LanguagesModule, EvangelisticExperiencesModule, EclExperiencesModule, CoursesModule, PreviousMarriageModule, ProfessionalExperiencesModule, PastEclExperiencesModule, PublicationsModule, EndowmentsModule, OrdinationsModule]
})
export class InfoModule {}

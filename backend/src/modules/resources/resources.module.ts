import { Module } from '@nestjs/common';
import { MaritalStatusModule } from './marital-status/marital-status.module';
import { UnionsModule } from './unions/unions.module';
import { AssociationsModule } from './associations/associations.module';
import { HiringStatusModule } from './hiring-status/hiring-status.module';
import { AcademicDegreesModule } from './academic-degrees/academic-degrees.module';
import { LanguageTypesModule } from './language-types/language-types.module';
import { EvangExpTypesModule } from './evang-exp-types/evang-exp-types.module';
import { EclExpTypesModule } from './ecl-exp-types/ecl-exp-types.module';
import { PublicationTypesModule } from './publication-types/publication-types.module';
import { EndowmentsTypesModule } from './endowments-types/endowments-types.module';
import { MinistryTypesModule } from './ministry-types/ministry-types.module';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

@Module({
  imports: [
    MaritalStatusModule,
    UnionsModule,
    AssociationsModule,
    HiringStatusModule,
    AcademicDegreesModule,
    LanguageTypesModule,
    EvangExpTypesModule,
    EclExpTypesModule,
    PublicationTypesModule,
    EndowmentsTypesModule,
    MinistryTypesModule,
  ],
})
export class ResourcesModule {}

import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { config } from 'dotenv'
import { KnexModule } from 'nest-knexjs'
import { InfoModule } from './modules/info/info.module'
import { PeopleModule } from './modules/people/people.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { SpousesModule } from './modules/spouses/spouses.module'
import { StudentsModule } from './modules/students/students.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './shared/auth/auth.module'
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard'
import { RolesGuard } from './shared/roles/gz_guards/roles.guard'
import { RolesModule } from './shared/roles/roles.module'
import { UtilService } from './shared/services/util.service'

config()

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        useNullAsDefault: true,
        connection: {
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          typeCast: function (field, next) {
            if (field.type === 'TINY' && field.length === 1) {
              return field.string() === '1' // 1 = true, 0 = false
            }
            return next()
          },
        },
      },
    }),
    UsersModule,
    PeopleModule,
    AuthModule,
    RolesModule,
    ResourcesModule,
    StudentsModule,
    SpousesModule,
    InfoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UtilService,
  ],
})
export class AppModule {}

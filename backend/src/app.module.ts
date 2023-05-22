import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { config } from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { PeopleModule } from './modules/people/people.module';
import { AuthModule } from './shared/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard';
import { RolesModule } from './shared/roles/roles.module';
import { RolesGuard } from './shared/roles/gz_guards/roles.guard';
import { ResourcesModule } from './modules/resources/resources.module';
import { StudentsModule } from './modules/students/students.module';
import { SpousesModule } from './modules/spouses/spouses.module';
import { InfoModule } from './modules/info/info.module';

config();

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
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { config } from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { PeopleModule } from './modules/people/people.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ItensCategoryModule } from './modules/resources/itensCategory/itensCategory.module';
import { ItensSubCategoryModule } from './modules/resources/itensSubCategory/itensSubCategory.module';
import { AuthModule } from './shared/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard';
import { RolesModule } from './shared/roles/roles.module';
import { RolesGuard } from './shared/roles/guards/roles.guard';

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
    AddressesModule,
    AuthModule,
    RolesModule,
    ItensCategoryModule,
    ItensSubCategoryModule,
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
export class AppModule { }

import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { config } from 'dotenv'
import { KnexModule, KnexModuleOptions } from 'nest-knexjs'
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
import { ApprovalsModule } from './modules/approvals/approvals.module'
import * as fs from 'fs'
import * as path from 'path'
import * as Nodemailer from 'nodemailer'

config()

const mysqlConfig: KnexModuleOptions = {
  config: {
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
      host: process.env.DEV ? process.env.SQL_DEV_HOST : process.env.SQL_HOST,
      user: process.env.DEV ? process.env.SQL_DEV_USER : process.env.SQL_USER,
      password: process.env.DEV
        ? process.env.SQL_DEV_PASS
        : process.env.SQL_PASS,
      database: process.env.DEV ? process.env.SQL_DEV_DB : process.env.SQL_DB,
      ssl: process.env.DEV
        ? undefined
        : {
            ca: fs.readFileSync(path.join(__dirname, 'mysql_ca_cert.pem')),
          },
      typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          // retorna tipo booleano ou null
          switch (field.string()) {
            case null:
            case undefined:
            case '':
            case 'null':
            case 'NULL':
              return null
            case '0':
              return false
            case '1':
              return true
          }
        } else if (field.type === 'DATE' && field.length > 1) {
          return field.string() // 1 = true, 0 = false
        } else if (field.type === 'DATETIME' && field.length > 1) {
          return field.string().substring(0, 10) // 1 = true, 0 = false
        }
        return next()
      },
    },
  },
}

const mssqlConfig: KnexModuleOptions = {
  config: {
    client: 'mssql',
    connection: {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: process.env.SQL_DB,
      options: { encrypt: true },
    },
  },
}

@Module({
  imports: [
    KnexModule.forRoot(mysqlConfig),
    UsersModule,
    PeopleModule,
    AuthModule,
    RolesModule,
    ResourcesModule,
    StudentsModule,
    SpousesModule,
    InfoModule,
    ApprovalsModule,
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

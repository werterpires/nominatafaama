import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { IApproveData } from '../types/types'
import { Console } from 'console'

@Injectable()
export class ApprovalsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async approveAny(data: IApproveData): Promise<boolean> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { id, approve, table } = data

        const columns = await this.knex(table).columnInfo()
        let approvedCollumn = ''
        const primaryKeyColumnResult = await this.knex.raw(
          `SHOW KEYS FROM \`${table}\` WHERE Key_name = 'PRIMARY'`,
        )

        const primaryKeyColumn = primaryKeyColumnResult[0][0].Column_name

        for (const column in columns) {
          if (column.includes('approved')) {
            approvedCollumn = column
            break
          }
        }

        if (approvedCollumn.length < 1 || !primaryKeyColumn) {
          throw new Error(
            'Não foram encontradas colunas válidas para execuatar a aprovação.',
          )
        }

        await trx(table)
          .update(approvedCollumn, approve)
          .where(primaryKeyColumn, id)

        await trx.commit()
      } catch (error) {
        console.error(`Erro capturado na ApprovalsModel approveAny: ${error}`)
        await trx.rollback()

        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return true
  }
}

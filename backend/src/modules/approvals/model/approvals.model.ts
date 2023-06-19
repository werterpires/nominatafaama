import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { IApproveData } from '../types/types'

@Injectable()
export class ApprovalsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async approveAny(data: IApproveData): Promise<boolean> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { id, approve, table } = data
        console.log(data)

        const columns = await this.knex(table).columnInfo()
        console.log(columns, table)

        let approvedCollumn = ''
        const firstColumn = Object.keys(columns)[0]

        for (const column in columns) {
          if (column.includes('approved')) {
            approvedCollumn = column
            break
          }
        }

        if (approvedCollumn.length < 1 || !firstColumn) {
          throw new Error(
            'Não foram encontradas colunas válidas para execuatar a aprovação.',
          )
        }

        await trx(table).update(approvedCollumn, approve).where(firstColumn, id)

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

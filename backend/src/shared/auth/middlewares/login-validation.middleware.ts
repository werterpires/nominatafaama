import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { validate } from 'class-validator'
import { LoginRequestBody } from '../types/types'

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body

    const loginRequestBody = new LoginRequestBody()
    loginRequestBody.email = body.email
    loginRequestBody.password = body.password

    const validations = await validate(loginRequestBody)
    if (validations.length > 0) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return [...acc, ...Object.values(curr.constraints!)]
        }, []),
      )
    }
    next()
  }
}

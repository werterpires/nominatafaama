import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { config } from 'dotenv'
import { UserFromJwt, UserPayload } from '../types/types'

config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    return {
      user_id: payload.sub,
      principal_email: payload.principal_email,
      name: payload.name,
      roles: payload.roles,
      user_approved: payload.user_approved,
    }
  }
}

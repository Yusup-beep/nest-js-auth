import { UserEntity } from '@/user/entities/user.entity'
import { UserService } from '@/user/user.service'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export interface AccessTokenPayload {
	sub: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private users: UserService

	public constructor(users: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: '<SECRET KEY>',
			signOptions: {
				expiresIn: '5m'
			}
		})

		this.users = users
	}

	async validate(payload: AccessTokenPayload): Promise<UserEntity> {
		const { sub: id } = payload

		const user = await this.users.findById(id)

		if (!user) {
			return null
		}

		return user
	}
}

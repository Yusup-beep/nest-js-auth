import { UserEntity } from '@/user/entities/user.entity'
import { UserService } from '@/user/user.service'
import {
	HttpException,
	HttpStatus,
	Injectable,
	Req,
	UnauthorizedException
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { RefreshRequest } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { TokenService } from './token.service'

export interface AuthenticationPayload {
	user: UserEntity
	payload: {
		type: string
		token: string
		refresh_token?: string
	}
}

@Injectable()
export class AuthService {
	private readonly users: UserService
	private readonly tokens: TokenService

	public constructor(users: UserService, tokens: TokenService) {
		this.users = users
		this.tokens = tokens
	}

	async register(dto: RegisterDto, @Req() req) {
		const { email } = dto
		const existUser = await this.users.findByEmail(email)
		if (existUser) {
			throw new HttpException('User already exist', HttpStatus.CONFLICT)
		}
		const user = await this.users.createUser(dto)
		const token = await this.tokens.generateAccessToken(user)
		const refresh = await this.tokens.generateRefreshToken(
			user,
			60 * 60 * 24 * 30,
			req
		)

		const payload = this.buildResponsePayload(user, token, refresh)

		return {
			status: 'success',
			data: payload
		}
	}

	async login(body: LoginDto, @Req() req) {
		const { email, password } = body

		const user = await this.users.findByEmail(email)

		const valid = user
			? await this.users.validateCredentials(user, password)
			: false

		if (!valid) {
			throw new UnauthorizedException('The login is invalid')
		}
		const token = await this.tokens.generateAccessToken(user)
		const refresh = await this.tokens.generateRefreshToken(
			user,
			60 * 60 * 24 * 30,
			req
		)

		const payload = this.buildResponsePayload(user, token, refresh)

		return {
			status: 'success',
			data: payload
		}
	}

	async refresh(body: RefreshRequest) {
		const { user, token } = await this.tokens.createAccessTokenFromRefreshToken(
			body.refresh_token
		)

		const payload = this.buildResponsePayload(user, token)

		return {
			status: 'success',
			data: payload
		}
	}

	async me(@Req() req) {
		const userId = req.user.id

		const user = await this.users.findById(userId)

		return {
			status: 'success',
			data: user
		}
	}

	private buildResponsePayload(
		user: UserEntity,
		accessToken: string,
		refreshToken?: string
	): AuthenticationPayload {
		return {
			user: user,
			payload: {
				type: 'bearer',
				token: accessToken,
				...(refreshToken ? { refresh_token: refreshToken } : {})
			}
		}
	}
}

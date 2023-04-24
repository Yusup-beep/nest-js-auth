import { UserEntity } from '@/user/entities/user.entity'
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { RefreshRequest } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { JWTGuard } from './guards/jwt.guard'
import { TokenService } from './token.service'

export interface AuthenticationPayload {
	user: UserEntity
	payload: {
		type: string
		token: string
		refresh_token?: string
	}
}

@Controller('auth')
export class AuthController {
	private readonly users: UserService
	private readonly tokens: TokenService

	public constructor(users: UserService, tokens: TokenService) {
		this.users = users
		this.tokens = tokens
	}
	@Post('/register')
	public async register(@Body() body: RegisterDto, @Req() req: Request) {
		const user = await this.users.createUser(body)
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

	@Post('/login')
	public async login(@Body() body: LoginDto, @Req() req: Request) {
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

	@Post('/refresh')
	public async refresh(@Body() body: RefreshRequest) {
		const { user, token } = await this.tokens.createAccessTokenFromRefreshToken(
			body.refresh_token
		)

		const payload = this.buildResponsePayload(user, token)

		return {
			status: 'success',
			data: payload
		}
	}

	@Get('/me')
	@UseGuards(JWTGuard)
	public async getUser(@Req() request) {
		const userId = request.user.id

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

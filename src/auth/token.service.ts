import { UserEntity } from '@/user/entities/user.entity'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { UserRepository } from '../user/user.repository'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { RefreshTokensRepository } from './refresh-token.repository'

const BASE_OPTIONS: SignOptions = {
	issuer: 'localhost:3000',
	audience: 'localhost:3000'
}
export interface RefreshTokenPayload {
	jti: number
	sub: number
}

@Injectable()
export class TokenService {
	private readonly tokens: RefreshTokensRepository
	private readonly users: UserRepository
	private readonly jwt: JwtService

	public constructor(
		tokens: RefreshTokensRepository,
		users: UserRepository,
		jwt: JwtService
	) {
		this.tokens = tokens
		this.users = users
		this.jwt = jwt
	}

	public async generateAccessToken(user: UserEntity): Promise<string> {
		const opts: SignOptions = {
			...BASE_OPTIONS,
			subject: String(user.id)
		}
		return this.jwt.signAsync({}, opts)
	}

	public async generateRefreshToken(
		user: UserEntity,
		expiresIn: number
	): Promise<string> {
		const token = await this.tokens.createRefreshToken(user, expiresIn)

		const opts: SignOptions = {
			...BASE_OPTIONS,
			expiresIn,
			subject: String(user.id),
			jwtid: String(token.id)
		}

		return this.jwt.signAsync({}, opts)
	}
	private async decodeRefreshToken(
		token: string
	): Promise<RefreshTokenPayload> {
		try {
			return this.jwt.verifyAsync(token)
		} catch (e) {
			if (e instanceof TokenExpiredError) {
				throw new UnprocessableEntityException('Refresh token expired')
			} else {
				throw new UnprocessableEntityException('Refresh token malformed')
			}
		}
	}
	private async getStoredTokenFromRefreshTokenPayload(
		payload: RefreshTokenPayload
	): Promise<RefreshTokenEntity | null> {
		const tokenId = payload.jti

		if (!tokenId) {
			throw new UnprocessableEntityException('Refresh token malformed')
		}

		return this.tokens.findTokenById(tokenId)
	}
	private async getUserFromRefreshTokenPayload(
		payload: RefreshTokenPayload
	): Promise<UserEntity> {
		const subId = payload.sub

		if (!subId) {
			throw new UnprocessableEntityException('Refresh token malformed')
		}

		return this.users.findById(subId)
	}

	public async resolveRefreshToken(
		encoded: string
	): Promise<{ user: UserEntity; token: RefreshTokenEntity }> {
		const payload = await this.decodeRefreshToken(encoded)
		const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

		if (!token) {
			throw new UnprocessableEntityException('Refresh token not found')
		}

		if (token.is_revoked) {
			throw new UnprocessableEntityException('Refresh token revoked')
		}

		const user = await this.getUserFromRefreshTokenPayload(payload)

		if (!user) {
			throw new UnprocessableEntityException('Refresh token malformed')
		}

		return { user, token }
	}

	public async createAccessTokenFromRefreshToken(
		refresh: string
	): Promise<{ token: string; user: UserEntity }> {
		const { user } = await this.resolveRefreshToken(refresh)

		const token = await this.generateAccessToken(user)

		return { user, token }
	}
}

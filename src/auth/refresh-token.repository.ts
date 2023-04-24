import { UserEntity } from '@/user/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { getClientIp } from 'request-ip'
import { Repository } from 'typeorm'
import { RefreshTokenEntity } from './entities/refresh-token.entity'

export class RefreshTokensRepository {
	private readonly refreshToken: Repository<RefreshTokenEntity>

	public constructor(
		@InjectRepository(RefreshTokenEntity)
		refreshToken: Repository<RefreshTokenEntity>
	) {
		this.refreshToken = refreshToken
	}
	public createRefreshToken(
		user: UserEntity,
		ttl: number,
		req: Request
	): Promise<RefreshTokenEntity> {
		const token = this.refreshToken.create()

		token.user_id = user.id
		token.is_revoked = false
		token.ip_address = this.getIp(req)
		const expiration = new Date()
		expiration.setTime(expiration.getTime() + ttl)

		token.expires = expiration

		return this.refreshToken.save(token)
	}

	public async findTokenById(id: number): Promise<RefreshTokenEntity | null> {
		return this.refreshToken.findOneBy({
			id
		})
	}
	getIp(req: Request): string {
		return getClientIp(req)
	}
}

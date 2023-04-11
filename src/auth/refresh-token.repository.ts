import { UserEntity } from '@/user/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
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
		ttl: number
	): Promise<RefreshTokenEntity> {
		const token = this.refreshToken.create()

		token.user_id = user.id
		token.is_revoked = false

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
}

import { UserModule } from '@/user/user.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { RefreshTokensRepository } from './refresh-token.repository'
import { TokenService } from './token.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([RefreshTokenEntity]),
		JwtModule.register({
			secret: '<SECRET KEY>',
			signOptions: {
				expiresIn: '5m'
			}
		}),
		UserModule
	],
	controllers: [AuthController],
	providers: [TokenService, RefreshTokensRepository]
})
export class AuthModule {}

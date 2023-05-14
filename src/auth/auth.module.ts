import { UserEntity } from '@/user/entities/user.entity'
import { UserModule } from '@/user/user.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { JWTGuard } from './guards/jwt.guard'
import { RolesGuard } from './guards/roles.guard'
import { RefreshTokensRepository } from './refresh-token.repository'
import { JwtStrategy } from './strategies/jwt.strategy'
import { TokenService } from './token.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
		JwtModule.register({
			secret: '<SECRET KEY>',
			signOptions: {
				expiresIn: '5m'
			}
		}),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		UserModule
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		TokenService,
		RefreshTokensRepository,
		JwtStrategy,
		JWTGuard,
		RolesGuard
	]
})
export class AuthModule {}

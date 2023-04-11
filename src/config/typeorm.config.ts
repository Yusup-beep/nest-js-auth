import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const getTypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: configService.get('DB_HOST'),
	port: +configService.get('DB_PORT'),
	database: configService.get('DB_NAME'),
	username: configService.get('DB_USERNAME'),
	password: configService.get('DB_PASSWORD'),
	autoLoadEntities: true,
	synchronize: true
})

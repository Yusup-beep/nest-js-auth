import {
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const ctx = context.switchToHttp()
		const request = ctx.getRequest()
		return request
	}

	handleRequest<User>(err, user: User): User {
		if (err || !user) {
			throw new UnauthorizedException()
		}
		return user
	}
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { UserRoles } from '../enums/user.enums'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		)
		const request = context.switchToHttp().getRequest()

		const authorization = request.headers
		console.log('Authorization', authorization)

		if (!requiredRoles) {
			return true
		}
		const { user } = context.switchToHttp().getRequest()
		return requiredRoles.some(role => user.roles?.includes(role))
	}
}

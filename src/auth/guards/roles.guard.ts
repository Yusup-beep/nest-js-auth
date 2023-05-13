import { UserService } from '@/user/user.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector, private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler())
		const request = context.switchToHttp().getRequest()

		const { id } = request.user
		const user = await this.userService.findById(id)
		return roles.includes(user.role)
	}
}

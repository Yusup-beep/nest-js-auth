import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { Roles } from './decorators/role.decorator'
import { JWTGuard } from './guards/jwt.guard'
import { RolesGuard } from './guards/roles.guard'

@Controller('auth')
export class AuthController {
	private readonly auth: AuthService

	public constructor(auth: AuthService) {
		this.auth = auth
	}

	@Post('/register')
	public async register(@Body() body, @Req() req: Request) {
		return this.auth.register(body, req)
	}

	@Post('/login')
	public async login(@Body() body, @Req() req: Request) {
		return this.auth.login(body, req)
	}

	@Get('/activate/:token')
	activate(@Param('token') token: string) {
		return this.auth.activate(token)
	}

	@Post('/refresh')
	public async refresh(@Body() body) {
		return this.auth.refresh(body)
	}

	@Get('/me')
	@UseGuards(JWTGuard)
	public async getUser(@Req() req) {
		return this.auth.me(req)
	}

	@Get('/secret')
	@UseGuards(JWTGuard, RolesGuard)
	@Roles('admin')
	public async secret() {
		return {
			access: true
		}
	}
}

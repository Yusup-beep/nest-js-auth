import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
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

	@Get('/private')
	//@Roles(UserRoles.USER)
	@UseGuards(JWTGuard, RolesGuard)
	public async private() {
		return {
			success: true
		}
	}

	@Post('/login')
	public async login(@Body() body, @Req() req: Request) {
		return this.auth.login(body, req)
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
}

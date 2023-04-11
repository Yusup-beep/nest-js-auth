import { RegisterDto } from '@/auth/dto/register.dto'
import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { UserEntity } from './entities/user.entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
	private readonly users: UserRepository

	public constructor(users: UserRepository) {
		this.users = users
	}

	public async validateCredentials(
		user: UserEntity,
		password: string
	): Promise<boolean> {
		return compare(password, user.password)
	}

	public async createUser(dto: RegisterDto): Promise<UserEntity> {
		const { email, password } = dto

		return this.users.create(email, password)
	}

	public async findByEmail(email: string): Promise<UserEntity | null> {
		return this.users.findByEmail(email)
	}
}

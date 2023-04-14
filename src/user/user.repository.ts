import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserRepository {
	private readonly users: Repository<UserEntity>

	public constructor(
		@InjectRepository(UserEntity) users: Repository<UserEntity>
	) {
		this.users = users
	}

	public async findById(id: number): Promise<UserEntity | null> {
		return this.users.findOneBy({ id })
	}

	public async findByEmail(email: string): Promise<UserEntity | null> {
		return this.users.findOneBy({ email })
	}

	public async create(email: string, password: string): Promise<UserEntity> {
		const user = this.users.create()

		user.email = email

		const salt = await bcrypt.genSalt(10)

		user.password = await bcrypt.hash(password, salt)

		return this.users.save(user)
	}
}

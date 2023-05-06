import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { UserRoles, UserStatus } from '@/auth/enums/user.enums'

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	email: string

	@Column()
	password: string

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.PENDING
	})
	status: UserStatus

	@Column({
		type: 'enum',
		enum: UserRoles,
		default: UserRoles.USER
	})
	role: string

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}

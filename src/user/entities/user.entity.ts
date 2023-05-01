import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

enum UserStatus {
	ACTIVE = 'active',
	BLOCKED = 'blocked',
	PENDING = 'pending'
}

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

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}

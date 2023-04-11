import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('refresh_tokens')
export class RefreshTokenEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	user_id: number

	@Column()
	is_revoked: boolean

	@Column()
	expires: Date
}

import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginDto {
	@IsNotEmpty({ message: 'A username is required' })
	@IsEmail()
	readonly email: string

	@IsNotEmpty({ message: 'A password is required to login' })
	readonly password: string
}

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {
	@IsNotEmpty({ message: 'An email is required' })
	@IsEmail()
	readonly email: string

	@IsNotEmpty({ message: 'A password is required' })
	@MinLength(6, { message: 'Your password must be at least 6 characters' })
	readonly password: string
}

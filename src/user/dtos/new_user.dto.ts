import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewUserDto {
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;
}
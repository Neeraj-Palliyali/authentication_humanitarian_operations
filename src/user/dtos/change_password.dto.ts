import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDTO {
    @IsNotEmpty()
    old_password: string;
    @IsNotEmpty()
    new_password: string;
}
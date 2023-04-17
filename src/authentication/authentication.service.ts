import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrpyt from 'bcrypt';
import { ExistingUserDto } from 'src/user/dtos/existing_user.dto';
import { ChangePasswordDTO } from 'src/user/dtos/change_password.dto';
import { NewUserDto } from 'src/user/dtos/new_user.dto';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserDetails } from 'src/user/user_info.interface';

@Injectable()
export class AuthenticationService {
    constructor(private userService: UserService,
        private jwtService: JwtService) { }

    // Helper function for hashing
    async hashPassword(password: string): Promise<string> {
        return bcrpyt.hash(password, 10);
    }

    async register(user: Readonly<NewUserDto>): Promise<null> {
        const { username, email, password } = user;
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException("Email already exists"); return;
        };

        const ex_user = await this.userService.findByusername(username);
        if (ex_user) {
            throw new BadRequestException('Username already in use!!'); return;
        }

        const hashedPassword = await this.hashPassword(password);
        await this.userService.create(username, email, hashedPassword);
        return;
    }

    // Helper for password check
    async passwordCheck(password: string, hashedPassword):
        Promise<boolean> {
        return bcrpyt.compare(password, hashedPassword);
    }

    // Helper to validate user
    async validateUser(email: string, password: string):
        Promise<UserDetails | null> {
        const user = await this.userService.findByEmail(email);
        const doesUserExist = !!user;
        if (!doesUserExist)  { throw new BadRequestException('No User exists!!'); };

        const passwordCheck = await this.passwordCheck(password, user.password);
        if (!passwordCheck) { throw new BadRequestException('The password entered does not match!!'); };

        return this.userService.getUserDetails(user.id);

    }

    async login(
        existingUser: ExistingUserDto,
    ): Promise<{ Token: string } | null> {
        const { email, password } = existingUser;
        const user = await this.validateUser(email, password);

        if (!user) return null;
        const jwt = await this.jwtService.signAsync({ user });
        return { Token: jwt };

    }

    async changePassword(
        id: string,
        changePassword: ChangePasswordDTO
    ): Promise<null> {
        const { old_password, new_password } = changePassword;

        const user = await this.userService.findById(id);
        const currenctpasswordCheck = await this.passwordCheck(old_password, user.password);

        if (!currenctpasswordCheck) { throw new BadRequestException('The password entered does not match the old password!!'); };
        user.password = await this.hashPassword(new_password);
        user.save()
        return;
    }

}

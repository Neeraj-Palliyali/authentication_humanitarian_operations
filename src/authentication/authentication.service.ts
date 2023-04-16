import { Injectable } from '@nestjs/common';

import * as bcrpyt from 'bcrypt';
import { ExistingUserDto } from 'src/user/dtos/existing_user.dto';
import { NewUserDto } from 'src/user/dtos/new_user.dto';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserDetails } from 'src/user/user_info.interface';

@Injectable()
export class AuthenticationService {
    constructor(private userService: UserService, 
        private jwtService: JwtService) { }

    async hashPassword(password: string): Promise<string> {
        return bcrpyt.hash(password, 10);
    }

    async register(user: Readonly<NewUserDto>): Promise<UserDetails | null | string> {
        const { username, email, password } = user;
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) return 'Email already in use!!'
        const ex_user = await this.userService.findByusername(username);
        if (ex_user) return 'Username already in use!!'

        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.userService.create(username, email, hashedPassword);
        return this.userService._getUserDetails(newUser);
    }

    async passwordCheck(password: string, hashedPassword):
        Promise<boolean> {
        return bcrpyt.compare(password, hashedPassword);
    }

    async validateUser(email: string, password: string):
    Promise<UserDetails| null>{
        const user = await this.userService.findByEmail(email);
        const doesUserExist = !!user;

        if (!doesUserExist) return null;
        
        const passwordCheck = await this.passwordCheck(password, user.password );
        if (!passwordCheck) return null;

        return this.userService._getUserDetails(user);

    }

    async login(
        existingUser: ExistingUserDto,
    ): Promise<{ token: string }| null> {
        const {email,password} = existingUser;
        const user = await this.validateUser(email, password);

        if(!user) return null;

        const jwt = await this.jwtService.signAsync({  user });

        return { token: jwt };
    }
    
}

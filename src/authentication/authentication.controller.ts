import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

import { UserDetails } from 'src/user/user_info.interface';
import { NewUserDto } from 'src/user/dtos/new_user.dto';
import { ExistingUserDto } from 'src/user/dtos/existing_user.dto';

@Controller('authentication')
export class AuthenticationController {
    constructor(private authenticationService: AuthenticationService) { }

    @Post('register')
    register(@Body() user: NewUserDto): Promise<UserDetails | null | string> {
        return this.authenticationService.register(user);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() user: ExistingUserDto): Promise<{ token: string } | null> {
        return this.authenticationService.login(user);
    }

}

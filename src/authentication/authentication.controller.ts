import { Controller, Body, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

import { ChangePasswordDTO } from 'src/user/dtos/change_password.dto';
import { ExistingUserDto } from 'src/user/dtos/existing_user.dto';
import { NewUserDto } from 'src/user/dtos/new_user.dto';

import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AuthenticationController {
    constructor(private authenticationService: AuthenticationService) { }

    @Post('register')
    @HttpCode(204)
    register(@Body() user: NewUserDto): Promise<null> {
        return this.authenticationService.register(user);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() user: ExistingUserDto): Promise<{ Token: string }> {
        return this.authenticationService.login(user);
    }

    @Post("actions/changepassword")
    @UseGuards(JwtGuard)
    async changePassword(@Request() req: any, @Body() changePassword: ChangePasswordDTO): Promise<null> {
        await this.authenticationService.changePassword(req.user.id, changePassword);
        return;
    }


}

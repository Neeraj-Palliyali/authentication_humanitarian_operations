import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDetails } from './user_info.interface';
import { JwtGuard } from 'src/authentication/guards/jwt.guard';

@Controller()
export class UserController {
    constructor(private userService: UserService) { }

    @Get('profiles')
    @UseGuards(JwtGuard)
    getUser(@Request() req: any): Promise<UserDetails | null> {
        return this.userService.getUserDetails(req.user.id);
    }
}

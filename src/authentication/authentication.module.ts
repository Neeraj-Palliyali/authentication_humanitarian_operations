import { Module } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from 'src/user/user.module';

import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [UserModule, JwtModule.registerAsync({
    useFactory:
      () => ({
        secret: 'quicksilver',
        signOptions: {
          expiresIn: '36000s'
        }
      })
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtGuard, JwtStrategy],
})
export class AuthenticationModule { }

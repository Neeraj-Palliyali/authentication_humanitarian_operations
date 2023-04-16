import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UserDetails } from './user_info.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: 
        Model<UserDocument>,
    ) { }

    _getUserDetails(user: UserDocument): UserDetails{
        return {
            id:user._id,
            username: user.username,
            email: user.email,
        };
    }

    async create(
        username: string, 
        email: string, 
        hashedPassword: string
        ): Promise<UserDocument>{
            const newUser = new this.userModel({
                username,
                email,
                password: hashedPassword
            });
            return newUser.save()
    }
}

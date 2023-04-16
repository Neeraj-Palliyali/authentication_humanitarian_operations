import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDetails } from './user_info.interface';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel:
            Model<UserDocument>,
    ) { }

    _getUserDetails(user: UserDocument): UserDetails {
        return {
            id: user._id,
            username: user.username,
            email: user.email,
        };
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }
    async findByusername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async fidnById(id: string): Promise<UserDetails | null> {
        const user = await this.userModel.findById(id).exec();
        if (!user) return null;
        return this._getUserDetails(user);
    }
    async create(
        username: string,
        email: string,
        hashedPassword: string
    ): Promise<UserDocument> {
        const newUser = new this.userModel({
            username,
            email,
            password: hashedPassword
        });
        return newUser.save()
    }
}

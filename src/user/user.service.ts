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

    async getUserDetails(id: string): Promise<UserDetails> {
        const user = await this.findById(id);
        if (!user) return null;
       
        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    }

    // Helper functions for identifiying user
    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }
    async findByusername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }
    async findById(id: string): Promise<UserDocument | null> {
        const user = await this.userModel.findById(id).exec();
        return user;
    }

    // Create the user
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

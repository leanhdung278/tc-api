import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

import { IUser } from '../interfaces/DefineModel';
import ServerConfig from '../configs/ServerConfig';
import { IsEmail, IsString, Length, IsNumber, IsOptional } from 'class-validator';

// Create the model schema & register your custom methods here
export interface IUserModel extends IUser, mongoose.Document {
    comparePassword(password: string, passwordCompare: string): Promise<{ status: boolean, data: string }>;
    hashPassword(password: string): Promise<string>;
}

// Define the User Schema
export const UserSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    groupCode: { type: String },
    avatarUrl: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    permissionCode: { type: String, default: ServerConfig.STATUS.DEFAULT },
    permissionName: { type: String, default: ServerConfig.STATUS.DEFAULT },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Number, default: Date.now() },
    cash: { type: Number, default: 0 },
    cashIn: { type: Number, default: 0 },
    cashOut: { type: Number, default: 0 },
    security: {
        odp: { type: Boolean, default: false },
        phone: { type: String },
        email: { type: String },
        status: { type: String, default: ServerConfig.STATUS.INACTIVE }
    },
    status: {
        lock: { type: Boolean, default: false },
        timeUnlock: { type: Number, default: -1 },
        note: { type: String }
    },
    token: { type: String }
}, {
    timestamps: true
});

// Compares the user's password with the request password
UserSchema.methods.comparePassword = (password: string, passwordCompare: string) => {
    return new Promise((res, rej) => {
        bcrypt.compare(password, passwordCompare, (err, success) => {
            if (err) return rej(err);
            success ? res({ status: true, data: ServerConfig.STATUS.SUCCESS }) : res({ status: false, data: 'Vui lòng kiểm tra lại mật khẩu' });
        })
    })
};

// Hash password the user's password with the request password
UserSchema.methods.hashPassword = (password: string) => {
    return new Promise((res, rej) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return rej(err);
            };
            res(hash);
        });
    });
}

export const User = mongoose.model<IUserModel>('users', UserSchema);

//START VALIDATOR
export class UserRegister {

    @IsString()
    @Length(3, 20)
    public username: string;

    @IsString()
    @Length(6, 20)
    public password: string;

    @IsEmail()
    public email: string;

    @IsString()
    @Length(5, 20)
    public phone: string;

};

export class UserLogin {

    @IsString()
    @Length(3, 20)
    public username: string;

    @IsString()
    @Length(6, 20)
    public password: string;

}

export class ChangePassword {

    @IsString()
    @Length(6, 20)
    public oldPassword: string;

    @IsString()
    @Length(6, 20)
    public newPassword: string;

}

export class ChangePasswordAdmin extends ChangePassword {

    @IsString()
    @Length(3, 10)
    public userCode: string;

}

export class UserBlock {

    @IsString()
    @Length(3, 20)
    public username: string;

    @IsNumber()
    public timeUnlock: number;

    @IsString()
    @Length(1, 500)
    @IsOptional()
    public note: string;

}

export class UserUnlock {

    @IsString()
    @Length(3, 20)
    public username: string;

    @IsString()
    @Length(1, 500)
    @IsOptional()
    public note: string;

}

import * as mongoose from 'mongoose';
import * as shortid from 'shortid';
import 'reflect-metadata';

import { IPermission } from '../interfaces/DefineModel';
import { IsString, Length, IsArray, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { User } from './UserModel';
import { Type } from 'class-transformer';

export interface IPermissionModel extends IPermission, mongoose.Document {
    _update: object;
    getQuery();
}

// Permission Schema
export const PermissionSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    name: { type: String, required: true },
    permission: [
        {
            method: { type: String },
            path: { type: String },
            name: { type: String },
            description: { type: Object },
            params: [String],
            query: [String]
        }
    ],
    isActive: { type: Boolean, default: true },
    note: { type: String }
}, {
    timestamps: true
});

//Update names when revising permissions
PermissionSchema.pre<IPermissionModel>('updateOne', async function (_next) {
    let self = this;
    if (
        self
        && self._update
        && self._update['$set']
        && self._update['$set'].name
        && self.getQuery()
        && self.getQuery().code
    ) {

        let { name } = self._update['$set'];
        let { code } = self.getQuery();

        await User.updateMany({ permissionCode: code }, {
            $set: {
                permissionName: name
            }
        });

        return _next()

    } else {
        return _next();
    }
});

export const Permission = mongoose.model<IPermissionModel>('permissions', PermissionSchema);

//START VALIDATOR
export interface data {
    method: string,
    key: string
}

export class PermissionNested {

    @IsString()
    @Length(3, 6)
    public method: string

    @IsString()
    @Length(1, 100)
    public key: string

}

export class PermissionCreate {

    @IsString()
    @Length(3, 100)
    public name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionNested)
    public permission: Array<PermissionNested>;

    @IsOptional()
    @Length(1, 500)
    @IsString()
    public note: string;

};

export class PermissionSet {

    @IsString()
    @Length(3, 20)
    public username: string;

    @IsString()
    @Length(1, 10)
    public permissionCode: string;

}

import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

import { IMailbox } from '../interfaces/DefineModel';
import { IsString, Length, IsArray, IsOptional } from 'class-validator';

export interface IMailboxModel extends IMailbox, mongoose.Document { }

//Mailbox Schema
export const MailboxSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    userCode: { type: String, required: true },
    class: { type: String },
    catalog: { type: String },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
});

export const Mailbox = mongoose.model<IMailboxModel>('mailboxs', MailboxSchema);

//START VALIDATOR
export class MailboxCreate {

    @IsString()
    @Length(3, 10)
    public userCode: string;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    public class: string;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    public catalog: string;

    @IsOptional()
    @IsString()
    @Length(1, 2000)
    public content: string;

};

export class MailboxUpdate {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    public class: string;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    public catalog: string;

    @IsString()
    @Length(1, 2000)
    public content: string;

}

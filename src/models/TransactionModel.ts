import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

import { ITransaction } from './../interfaces/DefineModel';
import { IsString, Length, IsNumber, Min, IsOptional } from 'class-validator';
import ServerConfig from '../configs/ServerConfig';

export interface ITransactionModel extends ITransaction, mongoose.Document { }

//Transaction Schema
export const TransactionSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    type: { type: Number, required: true },
    userCode: { type: String, required: true },
    userName: { type: String, required: true },
    transactionName: { type: String, required: true },
    cashBefore: { type: Number, required: true },
    cashAfter: { type: Number, required: true },
    status: { type: String, default: ServerConfig.STATUS.SUCCESS },
    isActive: { type: Boolean, default: true },
    content: { type: String },
    note: { type: String }
}, {
    timestamps: true
});

export const Transaction = mongoose.model<ITransactionModel>('transactions', TransactionSchema);

//START VALIDATOR
export class TransactionCreate {

    @IsNumber()
    @Min(0)
    public type: number;

    @IsString()
    @Length(3, 10)
    public userCode: string;

    @IsString()
    @Length(3, 20)
    public userName: string;

    @IsString()
    @Length(1, 100)
    public transactionName: string;

    @IsNumber()
    @Min(0)
    public cashBefore: number;

    @IsNumber()
    @Min(0)
    public cashAfter: number;

    @IsOptional()
    @IsString()
    @Length(1, 1000)
    public content?: string;

    @IsOptional()
    @IsString()
    @Length(1, 1000)
    public note?: string;

};

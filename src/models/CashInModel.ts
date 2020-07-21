import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

import { ICashInConfig, ICashIn } from '../interfaces/DefineModel';
import { IsString, Length, IsOptional, IsArray, ValidateNested, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import ServerConfig from '../configs/ServerConfig';

export interface ICashInConfigModel extends ICashInConfig, mongoose.Document { }
export interface ICashInModel extends ICashIn, mongoose.Document { }

//Cash in config schema
export const CashInConfigSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    type: { type: String, default: ServerConfig.FORM_CASH_IN.HANDMADE },
    carrierName: { type: String, required: true },
    denominations: [{
        _id: false,
        type: { type: Number, required: true },
        amount: { type: Number, required: true },
        percentReceived: { type: Number, required: true },
        unit: { type: String, default: ServerConfig.CASH_UNIT.VNĐ },
        amountReceived: { type: Number, required: true }
    }],
    isAllow: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    note: { type: String }
}, {
    timestamps: true
});

//Cash in schema
export const CashInSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    userCode: { type: String, required: true },
    username: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, default: ServerConfig.FORM_CASH_IN.HANDMADE },
    carrierCode: { type: String, required: true },
    carrierName: { type: String, required: true },
    cashCode: { type: String, required: true },
    cashSerial: { type: String, required: true },
    cashAmount: { type: Number, required: true },
    cashReceived: { type: Number, required: true },
    status: { type: String, default: ServerConfig.STATUS.WAITING },
    note: { type: String }
}, {
    timestamps: true
});

export const CashInConfig = mongoose.model<ICashInConfigModel>('cashinconfigs', CashInConfigSchema);
export const CashIn = mongoose.model<ICashInModel>('cashins', CashInSchema);

//START VALIDATOR
export class DenominationNested {

    @IsNumber()
    @Min(0)
    public amount: number;

    @IsNumber()
    @Min(0)
    public percentReceived: number;

}

export class CashConfigCreate {

    @IsString()
    @Length(1, 30)
    public carrierName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DenominationNested)
    public denominations: Array<DenominationNested>;

    @IsOptional()
    @IsString()
    @Length(1, 500)
    public note: string;

};

export class CashConfigUpdate {

    @IsString()
    @Length(1, 30)
    public carrierName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DenominationNested)
    public denominations: Array<DenominationNested>;

    @IsOptional()
    @IsBoolean()
    public isAllow: boolean;

    @IsOptional()
    @IsString()
    @Length(1, 500)
    public note: string;

};

export class NewCashClient {
    
    @IsString()
    @Length(3, 20)
    public username: string;

    @IsString()
    @Length(1, 50)
    public carrierName: string;

    @IsString()
    @Length(3, 50)
    public cashCode: string;

    @IsString()
    @Length(3, 50)
    public cashSerial: string;

    @IsNumber()
    @Min(0)
    public cashAmount: number;

};

export class AcceptCash {

    @IsString()
    @Length(3, 20)
    public cashinCode: string;

    @IsNumber()
    public type: number;

}
import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

import { ISlider } from '../interfaces/DefineModel';
import { IsString, Length, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';

export interface ISliderModel extends ISlider, mongoose.Document { }

//Slider Schema
export const SliderSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    href: { type: String, default: '#' },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isShow: { type: Boolean, default: true },
    timeShow: { type: Number },
    timeHide: { type: Number },
    note: { type: String }
}, {
    timestamps: true
});

export const Slider = mongoose.model<ISliderModel>('sliders', SliderSchema);

//START VALIDATOR
export class SliderCreate {

    @IsOptional()
    @IsString()
    @Length(1, 300)
    public href: string;

    @IsString()
    @Length(1, 300)
    public imageUrl: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public timeShow: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public timeHide: number;

    @IsOptional()
    @IsString()
    @Length(1, 500)
    public note: string;

};

export class SliderUpdate {

    @IsOptional()
    @IsString()
    @Length(1, 300)
    public href: string;

    @IsString()
    @IsOptional()
    @Length(1, 300)
    public imageUrl: string;

    @IsBoolean()
    public isShow: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public timeShow: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public timeHide: number;

    @IsOptional()
    @IsString()
    @Length(1, 500)
    public note: string;

};

import { Request, Response, NextFunction } from 'express';
import { IUser } from './DefineModel';

export interface DataStoredInToken {
    code: string,
    username: string;
}

export interface IPermissionOdd {
    method: string,
    path: string,
    name: string,
    params: string[],
    query: string[],
    description: object
}

export interface IRequest extends Request {
    user: IUser
}

export interface IResponse extends Response { }

export interface INextFunction extends NextFunction { }
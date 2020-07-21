import { Transaction } from './../models/TransactionModel';
import { Database } from '../providers/Database';
import { TransactionCreate } from '../models/TransactionModel';

import UserController from './UserController';

export default class TransactionController {

    public static read = async (query: any): Promise<{
        status: boolean,
        data: any,
        pagination?: {
            totalRows: number,
            totalPages: number
        }
    }> => {
        let doc = await Database.get('transactions', query);
        return doc;
    }

    public static create = async (data: TransactionCreate) => {
        let { userCode } = data;
        let user = await UserController.findOneUser({ code: userCode });
        if (!user) {
            return {
                status: false,
                data: 'An error occurred'
            }
        };
        let transaction = new Transaction(data);
        let doc = await transaction.save();
        return { status: true, data: doc };
    }

    //CLIENT
    public static client = new class { }

    //ADMIN
    public static admin = new class {

    }

}
import { Database } from '../providers/Database';
import { CashConfigCreate, CashInConfig, CashConfigUpdate, NewCashClient, CashIn, AcceptCash } from '../models/CashInModel';
import { PERMISSION } from '../configs/PermissionConfig';

import MailboxRouter from '../routes/MailboxRoute';
import { User } from '../models/UserModel';
import TransactionController from './TransactionController';
import UserController from './UserController';
import ServerConfig from '../configs/ServerConfig';

export default class CashInController {

    //Get permission group
    public static getPermission = (name: string) => PERMISSION.find(item => item.path == MailboxRouter.route && item.name == name);

    public static getCashConfig = async (query: any): Promise<{
        status: boolean,
        data: any,
        pagination?: {
            totalRows: number,
            totalPages: number
        }
    }> => {
        let doc = await Database.get('cashinconfigs', query);
        return doc;
    }

    public static getCash = async (query: any): Promise<{
        status: boolean,
        data: any,
        pagination?: {
            totalRows: number,
            totalPages: number
        }
    }> => {
        let doc = await Database.get('cashins', query);
        return doc;
    }

    //CLIENT
    public static client = new class {

        public NewCashClient = async (data: NewCashClient, userCode: string) => {

            //New card client
            let response = { status: false, data: 'An error occurred' };
            let cashIn = new CashIn();
            let cashinConfig = await CashInConfig.findOne({ carrierName: data.carrierName, 'denominations.amount': data.cashAmount });
            let user = await User.findOne({ username: data.username, code: userCode });

            if (!cashinConfig || !user) return response;

            let { carrierName } = cashinConfig;
            let { code, username } = user;
            let denominations = cashinConfig.denominations.find(item => item.amount = data.cashAmount);

            if (!denominations) return response;

            cashIn.carrierName = carrierName;
            cashIn.carrierCode = cashinConfig.code;
            cashIn.userCode = code;
            cashIn.username = username;
            cashIn.cashReceived = denominations.amountReceived;

            //Format
            let keys = Object.keys(data);
            keys.map(key => data[key] ? cashIn[key] = data[key] : cashIn[key] = undefined);

            //Save
            let doc = await cashIn.save();
            return { status: true, data: doc };

        };

    }

    //ADMIN
    public static admin = new class {

        public newCashConfig = async (data: CashConfigCreate) => {
            let cashInConfig = new CashInConfig();
            let keys = Object.keys(data);
            keys.map(key => data[key] ? cashInConfig[key] = data[key] : cashInConfig[key] = undefined);
            cashInConfig.denominations.map((item, index) => {
                item.type = index;
                item.amountReceived = (item.amount / 100) * item.percentReceived;
            });
            let doc = await cashInConfig.save();
            return { status: true, data: doc };
        }

        public deleteCashConfig = async (code: string) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await CashInConfig.updateOne({ code: code }, {
                $set: {
                    isActive: false,
                    isAllow: false
                }
            }, { new: true, omitUndefined: true })
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

        public updateCashConfig = async (code: string, data: CashConfigUpdate) => {
            let response = { status: false, data: 'An error occurred' };
            if (
                !data
                || !Object.keys(data).length
                || !data.denominations
                || !data.denominations.length
            ) {
                return response;
            }
            //Format
            data.denominations.map((item, index) => {
                item['type'] = index;
                item['amountReceived'] = (item.amount / 100) * item.percentReceived;
            })
            let update = await CashInConfig.updateOne({ code: code }, data as any, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

        public acceptCash = async (data: AcceptCash) => {
            let response = { status: false, data: 'An error occurred' };
            let cashin = await CashIn.findOne({ code: data.cashinCode, status: ServerConfig.STATUS.WAITING });
            if (
                !cashin
                || !cashin.userCode
                || !cashin.carrierCode
                || !cashin.cashReceived
            ) {
                return response;
            }
            let user = await User.findOne({ code: cashin.userCode });
            if (
                !user
                || !user.code
                || !user.cash
                || !user.cashIn
                || !user.username
            ) {
                return response;
            }
            switch (data.type) {
                case 0:
                    cashin.status = ServerConfig.STATUS.SUCCESS
                    break;
                case 1:
                    cashin.status = ServerConfig.STATUS.WRONG
                    break;
                case 2:
                    cashin.status = ServerConfig.STATUS.ERROR
                    break;
            }
            if (
                data.type === ServerConfig.CASH_IN_STATUS.SUCCESS
                && cashin.cashReceived > 0
            ) {
                await TransactionController.create({
                    cashBefore: user.cash,
                    cashAfter: user.cash + cashin.cashReceived,
                    transactionName: 'Nạp Tiền',
                    type: ServerConfig.TRANSACTION_TYPE.CASH_IN,
                    userCode: user.code,
                    userName: user.username
                });
                user.cash += cashin.cashReceived;
                user.cashIn += cashin.cashReceived;
            }

            await cashin.save();
            await user.save();

            return { status: true, data: undefined };
        }

    }

}
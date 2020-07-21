"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../providers/Database");
const CashInModel_1 = require("../models/CashInModel");
const PermissionConfig_1 = require("../configs/PermissionConfig");
const MailboxRoute_1 = require("../routes/MailboxRoute");
const UserModel_1 = require("../models/UserModel");
const TransactionController_1 = require("./TransactionController");
const ServerConfig_1 = require("../configs/ServerConfig");
class CashInController {
}
exports.default = CashInController;
//Get permission group
CashInController.getPermission = (name) => PermissionConfig_1.PERMISSION.find(item => item.path == MailboxRoute_1.default.route && item.name == name);
CashInController.getCashConfig = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield Database_1.Database.get('cashinconfigs', query);
    return doc;
});
CashInController.getCash = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield Database_1.Database.get('cashins', query);
    return doc;
});
//CLIENT
CashInController.client = new class {
    constructor() {
        this.NewCashClient = (data, userCode) => __awaiter(this, void 0, void 0, function* () {
            //New card client
            let response = { status: false, data: 'An error occurred' };
            let cashIn = new CashInModel_1.CashIn();
            let cashinConfig = yield CashInModel_1.CashInConfig.findOne({ carrierName: data.carrierName, 'denominations.amount': data.cashAmount });
            let user = yield UserModel_1.User.findOne({ username: data.username, code: userCode });
            if (!cashinConfig || !user)
                return response;
            let { carrierName } = cashinConfig;
            let { code, username } = user;
            let denominations = cashinConfig.denominations.find(item => item.amount = data.cashAmount);
            if (!denominations)
                return response;
            cashIn.carrierName = carrierName;
            cashIn.carrierCode = cashinConfig.code;
            cashIn.userCode = code;
            cashIn.username = username;
            cashIn.cashReceived = denominations.amountReceived;
            //Format
            let keys = Object.keys(data);
            keys.map(key => data[key] ? cashIn[key] = data[key] : cashIn[key] = undefined);
            //Save
            let doc = yield cashIn.save();
            return { status: true, data: doc };
        });
    }
};
//ADMIN
CashInController.admin = new class {
    constructor() {
        this.newCashConfig = (data) => __awaiter(this, void 0, void 0, function* () {
            let cashInConfig = new CashInModel_1.CashInConfig();
            let keys = Object.keys(data);
            keys.map(key => data[key] ? cashInConfig[key] = data[key] : cashInConfig[key] = undefined);
            cashInConfig.denominations.map((item, index) => {
                item.type = index;
                item.amountReceived = (item.amount / 100) * item.percentReceived;
            });
            let doc = yield cashInConfig.save();
            return { status: true, data: doc };
        });
        this.deleteCashConfig = (code) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield CashInModel_1.CashInConfig.updateOne({ code: code }, {
                $set: {
                    isActive: false,
                    isAllow: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.updateCashConfig = (code, data) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            if (!data
                || !Object.keys(data).length
                || !data.denominations
                || !data.denominations.length) {
                return response;
            }
            //Format
            data.denominations.map((item, index) => {
                item['type'] = index;
                item['amountReceived'] = (item.amount / 100) * item.percentReceived;
            });
            let update = yield CashInModel_1.CashInConfig.updateOne({ code: code }, data, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.acceptCash = (data) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let cashin = yield CashInModel_1.CashIn.findOne({ code: data.cashinCode, status: ServerConfig_1.default.STATUS.WAITING });
            if (!cashin
                || !cashin.userCode
                || !cashin.carrierCode
                || !cashin.cashReceived) {
                return response;
            }
            let user = yield UserModel_1.User.findOne({ code: cashin.userCode });
            if (!user
                || !user.code
                || !user.cash
                || !user.cashIn
                || !user.username) {
                return response;
            }
            switch (data.type) {
                case 0:
                    cashin.status = ServerConfig_1.default.STATUS.SUCCESS;
                    break;
                case 1:
                    cashin.status = ServerConfig_1.default.STATUS.WRONG;
                    break;
                case 2:
                    cashin.status = ServerConfig_1.default.STATUS.ERROR;
                    break;
            }
            if (data.type === ServerConfig_1.default.CASH_IN_STATUS.SUCCESS
                && cashin.cashReceived > 0) {
                yield TransactionController_1.default.create({
                    cashBefore: user.cash,
                    cashAfter: user.cash + cashin.cashReceived,
                    transactionName: 'Nạp Tiền',
                    type: ServerConfig_1.default.TRANSACTION_TYPE.CASH_IN,
                    userCode: user.code,
                    userName: user.username
                });
                user.cash += cashin.cashReceived;
                user.cashIn += cashin.cashReceived;
            }
            yield cashin.save();
            yield user.save();
            return { status: true, data: undefined };
        });
    }
};
//# sourceMappingURL=CashInController.js.map
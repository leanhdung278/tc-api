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
const UserModel_1 = require("../models/UserModel");
class UserController {
}
exports.default = UserController;
UserController.findUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        UserModel_1.User.find(query).exec((err, doc) => {
            if (err && !doc)
                return rej(err);
            !doc.length ? res(null) : res(doc);
        });
    });
});
UserController.findOneUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        UserModel_1.User.findOne(query).exec((err, doc) => {
            if (err && !doc)
                return rej(err);
            doc ? res(doc) : res(null);
        });
    });
});
UserController.changePassword = (userCode, data) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { status: false, data: 'An error occurred' };
    let { oldPassword, newPassword } = data;
    let user = yield UserModel_1.User.findOne({ code: userCode });
    if (!user || !user.password) {
        return response;
    }
    let compare = yield user.comparePassword(oldPassword, user.password);
    if (!compare.status)
        return response;
    let hash = yield user.hashPassword(newPassword);
    if (hash)
        user.password = hash;
    yield user.save();
    return { status: true, data: undefined };
});
//CLIENT
UserController.client = new class {
    constructor() {
        this.register = (data) => __awaiter(this, void 0, void 0, function* () {
            let { email, username, password, phone } = data;
            //-Check if the username has been used
            let result = yield UserController.findUser({ username: username });
            if (!result) {
                //-New user schema
                let user = new UserModel_1.User({ email: email, username: username, phone: phone });
                let hash = yield user.hashPassword(password);
                user.password = hash;
                //-Create new account and save
                let doc = yield user.save();
                let response = doc ? { status: true, data: doc } : { status: false, data: 'An error occurred' };
                return response;
            }
            else {
                return { status: false, data: 'This account is already in use' };
            }
        });
    }
};
//ADMIN
UserController.admin = new class {
    constructor() {
        this.read = (query) => __awaiter(this, void 0, void 0, function* () {
            let doc = yield Database_1.Database.get('users', query);
            return doc;
        });
        this.block = (data) => __awaiter(this, void 0, void 0, function* () {
            let { username, timeUnlock, note } = data;
            let response = { status: false, data: 'An error occurred' };
            let update = yield UserModel_1.User.updateOne({ username: username }, {
                $set: {
                    'status.lock': true,
                    'status.timeUnlock': timeUnlock,
                    'status.note': note
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.unlock = (data) => __awaiter(this, void 0, void 0, function* () {
            let { username, note } = data;
            let response = { status: false, data: 'An error occurred' };
            let update = yield UserModel_1.User.updateOne({ username: username }, {
                $set: {
                    'status.lock': false,
                    'status.timeUnlock': -1,
                    'status.note': note,
                    money: { cash: 10000, cashIn: 20000, cashOut: 30000 }
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
    }
};
//# sourceMappingURL=UserController.js.map
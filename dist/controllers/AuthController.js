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
const jwt = require("jsonwebtoken");
const dateformat = require("dateformat");
const ServerConfig_1 = require("../configs/ServerConfig");
const Locals_1 = require("../providers/Locals");
const UserModel_1 = require("../models/UserModel");
class AuthController {
}
exports.default = AuthController;
//CLIENT
AuthController.client = new class {
    constructor() {
        this.login = (data) => __awaiter(this, void 0, void 0, function* () {
            let { username, password } = data;
            let user = new UserModel_1.User();
            let doc = yield UserModel_1.User.findOne({ username: username });
            if (doc) {
                //-Check lock
                let present = Date.now();
                if (doc
                    && doc.status
                    && doc.status.lock
                    && doc.status.timeUnlock > present) {
                    return {
                        status: false,
                        data: `Account locked up ${dateformat(doc.status.timeUnlock, 'dd/mm/yyyy h:MM:ss TT')}`
                    };
                }
                //-Check password
                let check = yield user.comparePassword(password, doc.password);
                if (!check || !check.status)
                    return { status: false, data: 'Incorrect password' };
                //-Sign token
                let body = { code: doc.code, username: doc.username };
                let token = yield jwt.sign(body, Locals_1.default.config().appSecret, { expiresIn: Locals_1.default.config().jwtExpiresIn });
                if (!token) {
                    return {
                        status: false,
                        data: ServerConfig_1.default.STATUS.ERROR
                    };
                }
                //-Save token to database
                let response = yield UserModel_1.User.updateOne({ code: doc.code }, {
                    $set: {
                        token: token,
                        lastLogin: present
                    }
                }, {
                    new: true, omitUndefined: true
                });
                if (response.n == 1 && response.nModified == 1) {
                    doc.token = token;
                    return { status: true, data: doc };
                }
                return {
                    status: false,
                    data: ServerConfig_1.default.STATUS.ERROR
                };
            }
            return {
                status: false,
                data: 'Please check your account again'
            };
        });
        this.logout = (code) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield UserModel_1.User.updateOne({ code: code }, {
                $set: {
                    token: 'logout'
                }
            }, {
                new: true, omitUndefined: true
            });
            response = update.n == 1 || update.nModified == 1 ? { status: true, data: undefined } : { status: false, data: 'An error occurred' };
            return response;
        });
    }
};
//ADMIN
AuthController.admin = new class {
};
//# sourceMappingURL=AuthController.js.map
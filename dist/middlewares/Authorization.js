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
const dateFormat = require("dateformat");
const Api_1 = require("../providers/Api");
const UserController_1 = require("../controllers/UserController");
const Locals_1 = require("../providers/Locals");
const Log_1 = require("./Log");
/**
 * @step1 Get token in headers
 * @step2 Verify token and find account in the database with code decryption and check token
 * @step3 Check user is block
 * @step4 Attach to request
 */
function authorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { authorization } = req.headers;
            let decoded = yield jwt.verify(authorization, Locals_1.default.config().appSecret);
            //-Find user by code
            let user = yield UserController_1.default.findOneUser({
                isActive: true,
                code: decoded.code,
                username: decoded.username
            });
            if (!user) {
                return Api_1.API.badRequest(req, res, 'Authentication failed');
            }
            //-Check token
            if (authorization != user.token) {
                Api_1.API.badRequest(req, res, 'Token missing');
            }
            else {
                //-Check lock
                let present = Date.now();
                if (user
                    && user.status
                    && user.status.lock
                    && user.status.timeUnlock > present) {
                    return Api_1.API.badRequest(req, res, `Account locked up ${dateFormat(user.status.timeUnlock, 'dd/mm/yyyy h:MM:ss TT')}`);
                }
                else {
                    //-Attach user to request
                    req.user = user;
                    next();
                }
            }
        }
        catch (error) {
            //Log error
            let { hostname, originalUrl, method } = req;
            Log_1.default.error(`HOST: ${hostname} - PATH: ${originalUrl} - METHOD: ${method} - ERROR_MESSAGE: ${error.message} - STACKTRACE: ${error.stacktrace}`);
            //Sent
            Api_1.API.badRequest(req, res, 'Authentication failed');
        }
    });
}
exports.default = authorization;
//# sourceMappingURL=Authorization.js.map
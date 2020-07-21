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
const express_1 = require("express");
const UserModel_1 = require("../models/UserModel");
const Api_1 = require("../providers/Api");
const Validation_1 = require("../middlewares/Validation");
const AuthController_1 = require("../controllers/AuthController");
const Authorization_1 = require("../middlewares/Authorization");
class AuthRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
            login(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield AuthController_1.default.client.login(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            logout(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.user;
                        if (!code) {
                            return Api_1.API.badRequest(req, res, 'An error occurred');
                        }
                        let response = yield AuthController_1.default.client.logout(code);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
        };
        //ADMIN
        this.admin = class {
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router
            .post('/login', Validation_1.default(UserModel_1.UserLogin), this.client.login)
            .post('/logout', Authorization_1.default, this.client.logout);
    }
}
exports.default = AuthRouter;
AuthRouter.route = '/api/auth';
;
//# sourceMappingURL=AuthRoute.js.map
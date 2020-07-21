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
const Locals_1 = require("../providers/Locals");
const UserController_1 = require("../controllers/UserController");
const Authorization_1 = require("../middlewares/Authorization");
const Validation_1 = require("../middlewares/Validation");
const Permission_1 = require("../middlewares/Permission");
const express_1 = require("express");
const Api_1 = require("../providers/Api");
const UserModel_1 = require("../models/UserModel");
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
            register(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield UserController_1.default.client.register(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            changePassword(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.user;
                        let data = req.body;
                        let response = yield UserController_1.default.changePassword(code, data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
        };
        //ADMIN
        this.admin = new class {
            read(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let response = yield UserController_1.default.admin.read(req.query);
                        if (response && response.status) {
                            Api_1.API.ok(req, res, response.data, response.pagination);
                        }
                        else {
                            Api_1.API.badRequest(req, res, response.data);
                        }
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            block(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield UserController_1.default.admin.block(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            unlock(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield UserController_1.default.admin.unlock(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            changePassword(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let { userCode } = data;
                        let response = yield UserController_1.default.changePassword(userCode, data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        //CLIENT
        this.router
            .post('/register', this.client.register)
            .post('/change-password', Authorization_1.default, Validation_1.default(UserModel_1.ChangePassword), this.client.changePassword);
        //ADMIN
        this.router
            .get('/am', Authorization_1.default, Permission_1.default(), this.admin.read)
            .post('/am/block', Authorization_1.default, Permission_1.default(), Validation_1.default(UserModel_1.UserBlock), this.admin.block)
            .post('/am/unlock', Authorization_1.default, Permission_1.default(), Validation_1.default(UserModel_1.UserUnlock), this.admin.unlock)
            .post('/am/change-password', Authorization_1.default, Validation_1.default(UserModel_1.ChangePasswordAdmin), this.admin.changePassword);
    }
}
exports.default = UserRouter;
UserRouter.route = `/${Locals_1.default.config().apiPrefix}/user`;
;
//# sourceMappingURL=UserRoute.js.map
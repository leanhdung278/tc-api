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
const MailboxModel_1 = require("../models/MailboxModel");
const Api_1 = require("../providers/Api");
const Validation_1 = require("../middlewares/Validation");
const MailboxController_1 = require("../controllers/MailboxController");
const Authorization_1 = require("../middlewares/Authorization");
const Permission_1 = require("../middlewares/Permission");
const Utils_1 = require("../providers/Utils");
class MailboxRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
            read(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let query = req.query;
                        let { code } = req.user;
                        query['userCode'] = { eq: code };
                        let response = yield MailboxController_1.default.read(query);
                        response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            delete(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let userCode = req && req.user && req.user.code ? req.user.code : 'code';
                        let response = yield MailboxController_1.default.client.delete(code, userCode);
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
                        let query = req.query;
                        let response = yield MailboxController_1.default.read(query);
                        response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            create(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield MailboxController_1.default.admin.create(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            delete(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let response = yield MailboxController_1.default.admin.delete(code);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            update(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let data = req.body;
                        let response = yield MailboxController_1.default.admin.update(code, data);
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
        //Permission group
        let permissionGroup = Utils_1.default.getPermission('full_mailbox', MailboxRouter.route);
        //CLIENT
        this.router
            .get('/', Authorization_1.default, this.client.read)
            .delete('/:code', Authorization_1.default, this.client.delete);
        //ADMIN
        this.router
            .get('/am', Authorization_1.default, Permission_1.default(permissionGroup), this.admin.read)
            .post('/am/new', Authorization_1.default, Permission_1.default(permissionGroup), Validation_1.default(MailboxModel_1.MailboxCreate), this.admin.create)
            .put('/am/:code', Authorization_1.default, Permission_1.default(permissionGroup), Validation_1.default(MailboxModel_1.MailboxUpdate), this.admin.update)
            .delete('/am/:code', Authorization_1.default, Permission_1.default(permissionGroup), this.admin.delete);
    }
}
exports.default = MailboxRouter;
MailboxRouter.route = '/api/mailbox';
;
//# sourceMappingURL=MailboxRoute.js.map
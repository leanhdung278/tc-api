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
const CashInModel_1 = require("../models/CashInModel");
const Api_1 = require("../providers/Api");
const Validation_1 = require("../middlewares/Validation");
const Authorization_1 = require("../middlewares/Authorization");
const CashInController_1 = require("../controllers/CashInController");
const ServerConfig_1 = require("../configs/ServerConfig");
class CashInRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
            NewCashClient(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let { code } = req.user;
                        let response = yield CashInController_1.default.client.NewCashClient(data, code);
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
            readCard(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let query = req.query;
                        let response = yield CashInController_1.default.getCash(query);
                        response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            readCardWaiting(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let query = req.query;
                        query['status'] = { $eq: ServerConfig_1.default.STATUS.WAITING };
                        let response = yield CashInController_1.default.getCash(query);
                        response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            newCashConfig(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield CashInController_1.default.admin.newCashConfig(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            updateCashConfig(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let data = req.body;
                        let response = yield CashInController_1.default.admin.updateCashConfig(code, data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            deleteCashConfig(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let response = yield CashInController_1.default.admin.deleteCashConfig(code);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            acceptCash(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield CashInController_1.default.admin.acceptCash(data);
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
            .get('/config', Authorization_1.default, this.readCashConfig)
            .post('/new', Authorization_1.default, Validation_1.default(CashInModel_1.NewCashClient), this.client.NewCashClient);
        //ADMIN
        this.router
            .get('/am/waiting', Authorization_1.default, this.admin.readCardWaiting)
            .get('/am', Authorization_1.default, this.admin.readCard)
            .post('/am/config/new', Authorization_1.default, Validation_1.default(CashInModel_1.CashConfigCreate), this.admin.newCashConfig)
            .post('/am/accept', Authorization_1.default, Validation_1.default(CashInModel_1.AcceptCash), this.admin.acceptCash)
            .put('/am/config/:code', Authorization_1.default, Validation_1.default(CashInModel_1.CashConfigUpdate), this.admin.updateCashConfig)
            .delete('/am/config/:code', Authorization_1.default, this.admin.deleteCashConfig);
    }
    readCashConfig(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let response = yield CashInController_1.default.getCashConfig(query);
                response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
            }
            catch (error) {
                Api_1.API.serverError(req, res, error);
            }
        });
    }
}
exports.default = CashInRouter;
CashInRouter.route = '/api/cashin';
;
//# sourceMappingURL=CashInRoute.js.map
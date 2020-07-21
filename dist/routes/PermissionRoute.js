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
const PermissionModel_1 = require("../models/PermissionModel");
const Api_1 = require("../providers/Api");
const Validation_1 = require("../middlewares/Validation");
const PermissionController_1 = require("../controllers/PermissionController");
const Authorization_1 = require("../middlewares/Authorization");
const Permission_1 = require("../middlewares/Permission");
class PermissionRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
        };
        //ADMIN
        this.admin = new class {
            create(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield PermissionController_1.default.admin.create(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            read(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let response = yield PermissionController_1.default.admin.read(req.query);
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
            update(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let { code } = req.params;
                        let response = yield PermissionController_1.default.admin.update(code, data);
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
                        let response = yield PermissionController_1.default.admin.delete(code);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            setPermission(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield PermissionController_1.default.admin.setPermission(data);
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
        //ADMIN
        this.router
            .get('/am', Authorization_1.default, Permission_1.default(), this.admin.read)
            .post('/am/new', Authorization_1.default, Permission_1.default(), Validation_1.default(PermissionModel_1.PermissionCreate), this.admin.create)
            .put('/am/:code', Authorization_1.default, Permission_1.default(), Validation_1.default(PermissionModel_1.PermissionCreate), this.admin.update)
            .delete('/am/:code', Authorization_1.default, Permission_1.default(), this.admin.delete)
            .post('/am/set', Authorization_1.default, Permission_1.default(), Validation_1.default(PermissionModel_1.PermissionSet), this.admin.setPermission);
    }
}
exports.default = PermissionRouter;
PermissionRouter.route = '/api/permission';
;
//# sourceMappingURL=PermissionRoute.js.map
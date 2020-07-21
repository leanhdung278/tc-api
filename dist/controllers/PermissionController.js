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
const PermissionConfig_1 = require("../configs/PermissionConfig");
const Database_1 = require("../providers/Database");
const PermissionModel_1 = require("../models/PermissionModel");
const UserModel_1 = require("../models/UserModel");
class PermissionController {
}
exports.default = PermissionController;
//CLIENT
PermissionController.client = new class {
};
//ADMIN
PermissionController.admin = new class {
    constructor() {
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            let { name, permission, note } = data;
            //Check permission config
            let per = [];
            permission.map((o, i) => {
                let percf = PermissionConfig_1.PERMISSION.find(l => l.method == o.method && l.name == o.key);
                percf && percf.path && percf.name && percf.method && percf.description ? per.push(percf) : undefined;
            });
            //Create new model permission
            if (!per || !per.length)
                return { status: false, data: 'An error occurred' };
            let permissionModel = new PermissionModel_1.Permission({
                name: name,
                permission: per,
                note: note
            });
            //Save
            let response = yield permissionModel.save();
            return { status: true, data: response };
        });
        this.read = (query) => __awaiter(this, void 0, void 0, function* () {
            let doc = yield Database_1.Database.get('permissions', query);
            return doc;
        });
        this.update = (code, data) => __awaiter(this, void 0, void 0, function* () {
            let { name, permission, note } = data;
            let response = { status: false, data: 'An error occurred' };
            //Check permission config
            let per = [];
            permission.map((o, i) => {
                let percf = PermissionConfig_1.PERMISSION.find(l => l.method == o.method && l.name == o.key);
                percf && percf.path && percf.name && percf.method && percf.description ? per.push(percf) : undefined;
            });
            if (!per || !per.length) {
                return response;
            }
            ;
            //Create new model permission
            let update = yield PermissionModel_1.Permission.updateOne({ code: code }, {
                $set: {
                    name: name,
                    permission: per,
                    note: note
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.delete = (code) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield PermissionModel_1.Permission.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.setPermission = (data) => __awaiter(this, void 0, void 0, function* () {
            let { permissionCode, username } = data;
            let response = { status: false, data: 'An error occurred' };
            let permission = yield PermissionModel_1.Permission.findOne({ code: permissionCode });
            if (!permission || !permission.code || !permission.name) {
                return response;
            }
            let { code, name } = permission;
            let update = yield UserModel_1.User.updateOne({ username: username }, {
                $set: {
                    permissionCode: code,
                    permissionName: name
                }
            });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
    }
};
//# sourceMappingURL=PermissionController.js.map
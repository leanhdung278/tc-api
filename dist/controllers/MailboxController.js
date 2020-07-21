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
const MailboxModel_1 = require("../models/MailboxModel");
const PermissionConfig_1 = require("../configs/PermissionConfig");
const UserController_1 = require("./UserController");
const MailboxRoute_1 = require("../routes/MailboxRoute");
class MailboxController {
}
exports.default = MailboxController;
//Get permission group
MailboxController.getPermission = (name) => PermissionConfig_1.PERMISSION.find(item => item.path == MailboxRoute_1.default.route && item.name == name);
MailboxController.read = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield Database_1.Database.get('mailboxs', query);
    return doc;
});
//CLIENT
MailboxController.client = new class {
    constructor() {
        this.delete = (code, userCode) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield MailboxModel_1.Mailbox.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
    }
};
//ADMIN
MailboxController.admin = new class {
    constructor() {
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            //Check user code
            let user = yield UserController_1.default.findOneUser({ code: data.userCode });
            if (!user) {
                return {
                    status: false,
                    data: 'An error occurred'
                };
            }
            //New mailbox
            let mailbox = new MailboxModel_1.Mailbox();
            //Map and update data
            let keys = Object.keys(data);
            keys.map(key => data[key] ? mailbox[key] = data[key] : mailbox[key] = undefined);
            //Save
            let doc = yield mailbox.save();
            return { status: true, data: doc };
        });
        this.delete = (code) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield MailboxModel_1.Mailbox.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.update = (code, data) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield MailboxModel_1.Mailbox.updateOne({ code: code }, data, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
    }
};
//# sourceMappingURL=MailboxController.js.map
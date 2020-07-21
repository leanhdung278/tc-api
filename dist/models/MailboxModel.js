"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailboxUpdate = exports.MailboxCreate = exports.Mailbox = exports.MailboxSchema = void 0;
const mongoose = require("mongoose");
const shortid = require("shortid");
const class_validator_1 = require("class-validator");
//Mailbox Schema
exports.MailboxSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    userCode: { type: String, required: true },
    class: { type: String },
    catalog: { type: String },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
});
exports.Mailbox = mongoose.model('mailboxs', exports.MailboxSchema);
//START VALIDATOR
class MailboxCreate {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 10)
], MailboxCreate.prototype, "userCode", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 100)
], MailboxCreate.prototype, "class", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 100)
], MailboxCreate.prototype, "catalog", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 2000)
], MailboxCreate.prototype, "content", void 0);
exports.MailboxCreate = MailboxCreate;
;
class MailboxUpdate {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 100)
], MailboxUpdate.prototype, "class", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 100)
], MailboxUpdate.prototype, "catalog", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 2000)
], MailboxUpdate.prototype, "content", void 0);
exports.MailboxUpdate = MailboxUpdate;
//# sourceMappingURL=MailboxModel.js.map
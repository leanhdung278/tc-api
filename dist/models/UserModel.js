"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUnlock = exports.UserBlock = exports.ChangePasswordAdmin = exports.ChangePassword = exports.UserLogin = exports.UserRegister = exports.User = exports.UserSchema = void 0;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const shortid = require("shortid");
const ServerConfig_1 = require("../configs/ServerConfig");
const class_validator_1 = require("class-validator");
// Define the User Schema
exports.UserSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    groupCode: { type: String },
    avatarUrl: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    permissionCode: { type: String, default: ServerConfig_1.default.STATUS.DEFAULT },
    permissionName: { type: String, default: ServerConfig_1.default.STATUS.DEFAULT },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Number, default: Date.now() },
    cash: { type: Number, default: 0 },
    cashIn: { type: Number, default: 0 },
    cashOut: { type: Number, default: 0 },
    security: {
        odp: { type: Boolean, default: false },
        phone: { type: String },
        email: { type: String },
        status: { type: String, default: ServerConfig_1.default.STATUS.INACTIVE }
    },
    status: {
        lock: { type: Boolean, default: false },
        timeUnlock: { type: Number, default: -1 },
        note: { type: String }
    },
    token: { type: String }
}, {
    timestamps: true
});
// Compares the user's password with the request password
exports.UserSchema.methods.comparePassword = (password, passwordCompare) => {
    return new Promise((res, rej) => {
        bcrypt.compare(password, passwordCompare, (err, success) => {
            if (err)
                return rej(err);
            success ? res({ status: true, data: ServerConfig_1.default.STATUS.SUCCESS }) : res({ status: false, data: 'Vui lòng kiểm tra lại mật khẩu' });
        });
    });
};
// Hash password the user's password with the request password
exports.UserSchema.methods.hashPassword = (password) => {
    return new Promise((res, rej) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return rej(err);
            }
            ;
            res(hash);
        });
    });
};
exports.User = mongoose.model('users', exports.UserSchema);
//START VALIDATOR
class UserRegister {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], UserRegister.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(6, 20)
], UserRegister.prototype, "password", void 0);
__decorate([
    class_validator_1.IsEmail()
], UserRegister.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(5, 20)
], UserRegister.prototype, "phone", void 0);
exports.UserRegister = UserRegister;
;
class UserLogin {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], UserLogin.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(6, 20)
], UserLogin.prototype, "password", void 0);
exports.UserLogin = UserLogin;
class ChangePassword {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(6, 20)
], ChangePassword.prototype, "oldPassword", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(6, 20)
], ChangePassword.prototype, "newPassword", void 0);
exports.ChangePassword = ChangePassword;
class ChangePasswordAdmin extends ChangePassword {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 10)
], ChangePasswordAdmin.prototype, "userCode", void 0);
exports.ChangePasswordAdmin = ChangePasswordAdmin;
class UserBlock {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], UserBlock.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNumber()
], UserBlock.prototype, "timeUnlock", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 500),
    class_validator_1.IsOptional()
], UserBlock.prototype, "note", void 0);
exports.UserBlock = UserBlock;
class UserUnlock {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], UserUnlock.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 500),
    class_validator_1.IsOptional()
], UserUnlock.prototype, "note", void 0);
exports.UserUnlock = UserUnlock;
//# sourceMappingURL=UserModel.js.map
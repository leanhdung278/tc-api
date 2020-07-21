"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.PermissionSet = exports.PermissionCreate = exports.PermissionNested = exports.Permission = exports.PermissionSchema = void 0;
const mongoose = require("mongoose");
const shortid = require("shortid");
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const UserModel_1 = require("./UserModel");
const class_transformer_1 = require("class-transformer");
// Permission Schema
exports.PermissionSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    name: { type: String, required: true },
    permission: [
        {
            method: { type: String },
            path: { type: String },
            name: { type: String },
            description: { type: Object },
            params: [String],
            query: [String]
        }
    ],
    isActive: { type: Boolean, default: true },
    note: { type: String }
}, {
    timestamps: true
});
//Update names when revising permissions
exports.PermissionSchema.pre('updateOne', function (_next) {
    return __awaiter(this, void 0, void 0, function* () {
        let self = this;
        if (self
            && self._update
            && self._update['$set']
            && self._update['$set'].name
            && self.getQuery()
            && self.getQuery().code) {
            let { name } = self._update['$set'];
            let { code } = self.getQuery();
            yield UserModel_1.User.updateMany({ permissionCode: code }, {
                $set: {
                    permissionName: name
                }
            });
            return _next();
        }
        else {
            return _next();
        }
    });
});
exports.Permission = mongoose.model('permissions', exports.PermissionSchema);
class PermissionNested {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 6)
], PermissionNested.prototype, "method", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 100)
], PermissionNested.prototype, "key", void 0);
exports.PermissionNested = PermissionNested;
class PermissionCreate {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 100)
], PermissionCreate.prototype, "name", void 0);
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({ each: true }),
    class_transformer_1.Type(() => PermissionNested)
], PermissionCreate.prototype, "permission", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.Length(1, 500),
    class_validator_1.IsString()
], PermissionCreate.prototype, "note", void 0);
exports.PermissionCreate = PermissionCreate;
;
class PermissionSet {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], PermissionSet.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 10)
], PermissionSet.prototype, "permissionCode", void 0);
exports.PermissionSet = PermissionSet;
//# sourceMappingURL=PermissionModel.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Api_1 = require("../providers/Api");
function validation(type, skipMissingProperties = false) {
    return (req, res, next) => {
        class_validator_1.validate(class_transformer_1.plainToClass(type, req.body), { skipMissingProperties, whitelist: true, forbidNonWhitelisted: true })
            .then((errors) => {
            if (errors.length > 0) {
                let response = [];
                errors.map((error) => response.push({ property: error.property, constraints: error.constraints }));
                Api_1.API.invalid(req, res, response);
            }
            else {
                next();
            }
        });
    };
}
exports.default = validation;
//# sourceMappingURL=Validation.js.map
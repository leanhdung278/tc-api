"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerConfig {
}
exports.default = ServerConfig;
ServerConfig.STATUS = Object.freeze({
    DEFAULT: 'DEFAULT',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    WAITING: 'WAITING',
    WRONG: 'WRONG',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
});
ServerConfig.LIMIT_DEFAULT = 20;
ServerConfig.OFFSET_DEFAULT = 0;
ServerConfig.FORM_CASH_IN = Object.freeze({
    AUTO: 'AUTO',
    HANDMADE: 'HANDMADE'
});
ServerConfig.CASH_IN_STATUS = Object.freeze({
    SUCCESS: 0,
    WRONG: 1,
    ERROR: 2
});
ServerConfig.CASH_UNIT = Object.freeze({
    VNĐ: 'VNĐ',
    USD: 'USD'
});
ServerConfig.TRANSACTION_TYPE = Object.freeze({
    CASH_IN: 0,
    CASH_OUT: 1,
    TRANSFERS_OUT: 2,
    TRANSFERS_IN: 3
});
//# sourceMappingURL=ServerConfig.js.map
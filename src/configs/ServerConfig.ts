export default class ServerConfig {

    public static STATUS = Object.freeze({
        DEFAULT: 'DEFAULT',
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE',
        WAITING: 'WAITING',
        WRONG: 'WRONG',
        ERROR: 'ERROR',
        SUCCESS: 'SUCCESS'
    })

    public static LIMIT_DEFAULT = 20;

    public static OFFSET_DEFAULT = 0;

    public static FORM_CASH_IN = Object.freeze({
        AUTO: 'AUTO',
        HANDMADE: 'HANDMADE'
    })

    public static CASH_IN_STATUS = Object.freeze({
        SUCCESS: 0,
        WRONG: 1,
        ERROR: 2
    })

    public static CASH_UNIT = Object.freeze({
        VNĐ: 'VNĐ',
        USD: 'USD'
    })

    public static TRANSACTION_TYPE = Object.freeze({
        CASH_IN: 0,
        CASH_OUT: 1,
        TRANSFERS_OUT: 2,
        TRANSFERS_IN: 3
    })

}
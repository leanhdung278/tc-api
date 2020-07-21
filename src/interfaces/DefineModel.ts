export interface IUser {
    code: string,
    groupCode: string,
    avatarUrl: string,
    email: string,
    username: string,
    password: string,
    phone: string,
    permissionCode: string,
    permissionName: string,
    isActive: boolean,
    lastLogin: number,
    cash: number,
    cashIn: number,
    cashOut: number
    security: {
        odp: boolean,
        phone: string,
        email: string,
        status: string
    },
    status: {
        lock: boolean,
        timeUnlock: number,
        note: string
    },
    token: string
}

export interface IPermission {
    code: string,
    name: string,
    permission: Array<{
        method: string,
        path: string,
        name: string,
        description: object,
        params: Array<string>,
        query: Array<string>
    }>,
    isActive: boolean,
    note: string
}

export interface IMailbox {
    code: string,
    userCode: string,
    class: string,
    catalog: string,
    content: string,
    isActive: boolean,
    isRead: boolean,
}

export interface ISlider {
    code: string,
    href: string,
    imageUrl: string,
    isActive: boolean,
    isShow: boolean,
    timeShow: number,
    timeHide: number,
    note: string
}

export interface ICashInConfig {
    code: string,
    type: string,
    carrierName: string,
    carrierType: number,
    denominations: {
        type: number,
        amount: number,
        percentReceived: number,
        unit: string,
        amountReceived: number
    }[],
    isAllow: boolean,
    isActive: boolean,
    note: string
}

export interface ICashIn {
    code: string,
    userCode: string,
    username: string,
    isActive: boolean,
    type: string,
    carrierCode: string,
    carrierName: string,
    cashCode: string,
    cashSerial: string,
    cashAmount: number,
    cashReceived: number,
    status: string,
    note: string
}

export interface ITransaction {
    code: string,
    type: string,
    userCode: string,
    userName: string,
    transactionName: string,
    cashBefore: number,
    cashAfter: number,
    isActive: boolean,
    status: string,
    content: string,
    note: string
}
import { IPermissionOdd } from "../interfaces/DefineServer";

export const PERMISSION: IPermissionOdd[] = [

    //USER
    {
        method: 'ALL',
        path: '/api/user',
        name: 'full_user',
        params: ['code'],
        query: ['limit', 'offset', 'sort', 'eq', 'gte', 'lte', 'contains'],
        description: {
            vi: 'Quyền quản lý người dùng'
        }
    },
    //PERMISSION
    {
        method: 'GET',
        path: '/api/permission/am',
        name: 'read_permission',
        params: ['none'],
        query: ['limit', 'offset', 'sort', 'eq', 'gte', 'lte', 'contains'],
        description: {
            vi: 'Lấy danh sách nhóm quyền'
        }
    },
    {
        method: 'POST',
        path: '/api/permission/am/new',
        name: 'create_permission',
        params: ['none'],
        query: ['none'],
        description: {
            vi: 'Tạo danh sách nhóm quyền'
        }
    },
    {
        method: 'PUT',
        path: '/api/permission/am',
        name: 'update_permission',
        params: ['code'],
        query: ['none'],
        description: {
            vi: 'Sửa nhóm quyền'
        }
    },
    {
        method: 'DELETE',
        path: '/api/permission/am',
        name: 'delete_permission',
        params: ['code'],
        query: ['none'],
        description: {
            vi: 'Xoá nhóm quyền'
        }
    },
    {
        method: 'POST',
        path: '/api/permission/am/set',
        name: 'set_permission',
        params: ['code'],
        query: ['none'],
        description: {
            vi: 'Set nhóm quyền cho nguời dùng'
        }
    },
    //SLIDER
    {
        method: 'ALL',
        path: '/api/slider',
        name: 'full_slider',
        params: ['code'],
        query: ['limit', 'offset', 'sort', 'eq', 'gte', 'lte', 'contains'],
        description: {
            vi: 'Quyền quản lý slider show'
        }
    },
    //MAILBOX
    {
        method: 'ALL',
        path: '/api/mailbox',
        name: 'full_mailbox',
        params: ['code'],
        query: ['limit', 'offset', 'sort', 'eq', 'gte', 'lte', 'contains'],
        description: {
            vi: 'Quyền quản lý hộp thư'
        }
    }
]
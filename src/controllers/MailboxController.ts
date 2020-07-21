import { Database } from '../providers/Database';
import { MailboxCreate, Mailbox, MailboxUpdate } from '../models/MailboxModel';
import { PERMISSION } from '../configs/PermissionConfig';

import UserController from './UserController';
import MailboxRouter from '../routes/MailboxRoute';

export default class MailboxController {

    //Get permission group
    public static getPermission = (name: string) => PERMISSION.find(item => item.path == MailboxRouter.route && item.name == name);

    public static read = async (query: any): Promise<{
        status: boolean,
        data: any,
        pagination?: {
            totalRows: number,
            totalPages: number
        }
    }> => {
        let doc = await Database.get('mailboxs', query);
        return doc;
    }

    //CLIENT
    public static client = new class {

        public delete = async (code: string, userCode: string) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await Mailbox.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

    }

    //ADMIN
    public static admin = new class {

        public create = async (data: MailboxCreate) => {
            //Check user code
            let user = await UserController.findOneUser({ code: data.userCode });
            if (!user) {
                return {
                    status: false,
                    data: 'An error occurred'
                };
            }
            //New mailbox
            let mailbox = new Mailbox();
            //Map and update data
            let keys = Object.keys(data);
            keys.map(key => data[key] ? mailbox[key] = data[key] : mailbox[key] = undefined);
            //Save
            let doc = await mailbox.save();
            return { status: true, data: doc };
        }

        public delete = async (code: string) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await Mailbox.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

        public update = async (code: string, data: MailboxUpdate) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await Mailbox.updateOne({ code: code }, data, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

    }

}
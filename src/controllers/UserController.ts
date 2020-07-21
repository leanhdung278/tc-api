import { IUser } from './../interfaces/DefineModel';
import { UserRegister, UserBlock, UserUnlock, ChangePassword } from '../models/UserModel'
import { Database } from '../providers/Database';
import { User } from '../models/UserModel';

export default class UserController {

    public static findUser = async (query: any): Promise<IUser[]> => {
        return new Promise((res, rej) => {
            User.find(query).exec((err, doc) => {
                if (err && !doc) return rej(err);
                !doc.length ? res(null) : res(doc);
            })
        })
    }

    public static findOneUser = async (query: any): Promise<IUser> => {
        return new Promise((res, rej) => {
            User.findOne(query).exec((err, doc) => {
                if (err && !doc) return rej(err);
                doc ? res(doc) : res(null);
            })
        })
    }

    public static changePassword = async (userCode: string, data: ChangePassword) => {

        let response = { status: false, data: 'An error occurred' };
        let { oldPassword, newPassword } = data;

        let user = await User.findOne({ code: userCode });
        if (!user || !user.password) {
            return response;
        }

        let compare = await user.comparePassword(oldPassword, user.password);
        if (!compare.status) return response;
        let hash = await user.hashPassword(newPassword);
        if (hash) user.password = hash

        await user.save();
        return { status: true, data: undefined };

    }

    //CLIENT
    public static client = new class {

        public register = async (data: UserRegister) => {
            let { email, username, password, phone } = data;

            //-Check if the username has been used
            let result = await UserController.findUser({ username: username });

            if (!result) {
                //-New user schema
                let user = new User({ email: email, username: username, phone: phone });
                let hash = await user.hashPassword(password);
                user.password = hash;
                //-Create new account and save
                let doc = await user.save();
                let response = doc ? { status: true, data: doc } : { status: false, data: 'An error occurred' };
                return response;
            } else {
                return { status: false, data: 'This account is already in use' };
            }
        }

    }

    //ADMIN
    public static admin = new class {

        public read = async (query: any): Promise<{
            status: boolean,
            data: any,
            pagination?: {
                totalRows: number,
                totalPages: number
            }
        }> => {
            let doc = await Database.get('users', query);
            return doc;
        }

        public block = async (data: UserBlock) => {
            let { username, timeUnlock, note } = data;
            let response = { status: false, data: 'An error occurred' };
            let update = await User.updateOne({ username: username }, {
                $set: {
                    'status.lock': true,
                    'status.timeUnlock': timeUnlock,
                    'status.note': note
                }
            }, { new: true, omitUndefined: true });

            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

        public unlock = async (data: UserUnlock) => {
            let { username, note } = data;
            let response = { status: false, data: 'An error occurred' };
            let update = await User.updateOne({ username: username }, {
                $set: {
                    'status.lock': false,
                    'status.timeUnlock': -1,
                    'status.note': note,
                    money: { cash: 10000, cashIn: 20000, cashOut: 30000 }
                }
            }, { new: true, omitUndefined: true });

            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

    }

}
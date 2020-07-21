import { PERMISSION } from '../configs/PermissionConfig';
import { Database } from '../providers/Database';
import { PermissionCreate, PermissionSet } from '../models/PermissionModel';
import { Permission } from '../models/PermissionModel';
import { User } from '../models/UserModel';

export default class PermissionController {

    //CLIENT
    public static client = new class {

    }

    //ADMIN
    public static admin = new class {

        public create = async (data: PermissionCreate): Promise<{ status: boolean, data: any }> => {

            let { name, permission, note } = data;

            //Check permission config
            let per = [];
            permission.map((o, i) => {
                let percf = PERMISSION.find(l => l.method == o.method && l.name == o.key);
                percf && percf.path && percf.name && percf.method && percf.description ? per.push(percf) : undefined;
            })

            //Create new model permission
            if (!per || !per.length) return { status: false, data: 'An error occurred' };
            let permissionModel = new Permission({
                name: name,
                permission: per,
                note: note
            });

            //Save
            let response = await permissionModel.save();

            return { status: true, data: response };
        }

        public read = async (query: any): Promise<{
            status: boolean,
            data: any,
            pagination?: {
                totalRows: number,
                totalPages: number
            }
        }> => {
            let doc = await Database.get('permissions', query);
            return doc;
        }

        public update = async (code: string, data: PermissionCreate) => {

            let { name, permission, note } = data;
            let response = { status: false, data: 'An error occurred' };

            //Check permission config
            let per = [];
            permission.map((o, i) => {
                let percf = PERMISSION.find(l => l.method == o.method && l.name == o.key);
                percf && percf.path && percf.name && percf.method && percf.description ? per.push(percf) : undefined;
            });

            if (!per || !per.length) {
                return response;
            };

            //Create new model permission
            let update = await Permission.updateOne({ code: code }, {
                $set: {
                    name: name,
                    permission: per,
                    note: note
                }
            }, { new: true, omitUndefined: true })

            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;

        }

        public delete = async (code: string) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await Permission.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true })
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

        public setPermission = async (data: PermissionSet) => {
            let { permissionCode, username } = data;
            let response = { status: false, data: 'An error occurred' };
            let permission = await Permission.findOne({ code: permissionCode });
            if (!permission || !permission.code || !permission.name) {
                return response;
            }
            let { code, name } = permission;
            let update = await User.updateOne({ username: username }, {
                $set: {
                    permissionCode: code,
                    permissionName: name
                }
            })
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

    }

}
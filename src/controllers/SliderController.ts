import { Database } from '../providers/Database';
import { PERMISSION } from '../configs/PermissionConfig';
import { SliderCreate, Slider, SliderUpdate } from '../models/SliderModel'

import SliderRouter from '../routes/SliderRoute';

export default class SliderController {

    //Get permission group
    public static getPermission = (name: string) => PERMISSION.find(item => item.path == SliderRouter.route && item.name == name);

    public static read = async (query: any): Promise<{
        status: boolean,
        data: any,
        pagination?: {
            totalRows: number,
            totalPages: number
        }
    }> => {
        let doc = await Database.get('sliders', query);
        return doc;
    }

    //CLIENT
    public static client = new class { }

    //ADMIN
    public static admin = new class {

        public create = async (data: SliderCreate) => {
            //New slider
            let slider = new Slider();
            //Map and update data
            let keys = Object.keys(data);
            keys.map(key => data[key] ? slider[key] = data[key] : slider[key] = undefined);
            //Save
            let doc = await slider.save();
            return { status: true, data: doc };
        }

        public delete = async (code: string) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await Slider.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

        public update = async (code: string, data: SliderUpdate) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await Slider.updateOne({ code: code }, data, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1) response = { status: true, data: undefined };
            return response;
        }

    }

}
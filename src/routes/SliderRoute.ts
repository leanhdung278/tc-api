import { Router } from 'express';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { SliderCreate, SliderUpdate } from '../models/SliderModel';
import { API } from '../providers/Api';

import validation from '../middlewares/Validation';
import authorization from '../middlewares/Authorization';
import SliderController from '../controllers/SliderController';
import permission from '../middlewares/Permission';
import Util from '../providers/Utils';

export default class SliderRouter {

    public static route = '/api/slider';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //Permission group
        let permissionGroup = Util.getPermission('full_slider', SliderRouter.route);

        //CLIENT
        this.router
            .get('/', authorization, this.read)

        //ADMIN
        this.router
            .get('/am', authorization, this.read)
            .post('/am/new', authorization, permission(permissionGroup), validation(SliderCreate), this.admin.create)
            .put('/am/:code', authorization, permission(permissionGroup), validation(SliderUpdate), this.admin.update)
            .delete('/am/:code', authorization, permission(permissionGroup), this.admin.delete)
    }

    private async read(req: IRequest, res: IResponse, next: INextFunction) {
        try {
            let query = req.query;
            let response = await SliderController.read(query);
            response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
        } catch (error) {
            API.serverError(req, res, error);
        }
    }

    //CLIENT
    private client = new class { }

    //ADMIN
    private admin = new class {

        async create(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as SliderCreate;
                let response = await SliderController.admin.create(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async delete(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let response = await SliderController.admin.delete(code);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async update(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let data = req.body as SliderUpdate;
                let response = await SliderController.admin.update(code, data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }
};
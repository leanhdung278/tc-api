import { Router } from 'express';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { PermissionCreate, PermissionSet } from '../models/PermissionModel';
import { API } from '../providers/Api';

import validation from '../middlewares/Validation';
import PermissionController from '../controllers/PermissionController';
import authorization from '../middlewares/Authorization';
import permission from '../middlewares/Permission';

export default class PermissionRouter {

    public static route = '/api/permission';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //ADMIN
        this.router
            .get('/am', authorization, permission(), this.admin.read)
            .post('/am/new', authorization, permission(), validation(PermissionCreate), this.admin.create)
            .put('/am/:code', authorization, permission(), validation(PermissionCreate), this.admin.update)
            .delete('/am/:code', authorization, permission(), this.admin.delete)
            .post('/am/set', authorization, permission(), validation(PermissionSet), this.admin.setPermission)
    }

    //CLIENT
    private client = new class {

    }

    //ADMIN
    private admin = new class {

        async create(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as PermissionCreate;
                let response = await PermissionController.admin.create(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async read(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let response = await PermissionController.admin.read(req.query);
                if (response && response.status) {
                    API.ok(req, res, response.data, response.pagination)
                } else {
                    API.badRequest(req, res, response.data)
                }
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async update(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as PermissionCreate;
                let { code } = req.params;
                let response = await PermissionController.admin.update(code, data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async delete(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let response = await PermissionController.admin.delete(code);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async setPermission(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as PermissionSet;
                let response = await PermissionController.admin.setPermission(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }
};
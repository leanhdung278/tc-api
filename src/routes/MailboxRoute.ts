import { Router } from 'express';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { MailboxCreate, MailboxUpdate } from '../models/MailboxModel';
import { API } from '../providers/Api';

import validation from '../middlewares/Validation';
import MailboxController from '../controllers/MailboxController';
import authorization from '../middlewares/Authorization';
import permission from '../middlewares/Permission';
import Util from '../providers/Utils';

export default class MailboxRouter {

    public static route = '/api/mailbox';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //Permission group
        let permissionGroup = Util.getPermission('full_mailbox', MailboxRouter.route);

        //CLIENT
        this.router
            .get('/', authorization, this.client.read)
            .delete('/:code', authorization, this.client.delete)

        //ADMIN
        this.router
            .get('/am', authorization, permission(permissionGroup), this.admin.read)
            .post('/am/new', authorization, permission(permissionGroup), validation(MailboxCreate), this.admin.create)
            .put('/am/:code', authorization, permission(permissionGroup), validation(MailboxUpdate), this.admin.update)
            .delete('/am/:code', authorization, permission(permissionGroup), this.admin.delete)
            
    }

    //CLIENT
    private client = new class {

        async read(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let query = req.query;
                let { code } = req.user;
                query['userCode'] = { eq: code };
                let response = await MailboxController.read(query);
                response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async delete(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let userCode = req && req.user && req.user.code ? req.user.code : '';
                let response = await MailboxController.client.delete(code, userCode);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }

    //ADMIN
    private admin = new class {

        async read(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let query = req.query;
                let response = await MailboxController.read(query);
                response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async create(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as MailboxCreate;
                let response = await MailboxController.admin.create(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async delete(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let response = await MailboxController.admin.delete(code);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async update(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let data = req.body as MailboxUpdate;
                let response = await MailboxController.admin.update(code, data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }
};
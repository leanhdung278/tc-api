import { Router } from 'express';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { CashConfigCreate, CashConfigUpdate, NewCashClient, AcceptCash } from '../models/CashInModel';
import { API } from '../providers/Api';

import validation from '../middlewares/Validation';
import authorization from '../middlewares/Authorization';
import CashInController from '../controllers/CashInController';
import ServerConfig from '../configs/ServerConfig';

export default class CashInRouter {

    public static route = '/api/cashin';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //CLIENT
        this.router
            .get('/config', authorization, this.readCashConfig)
            .post('/new', authorization, validation(NewCashClient), this.client.NewCashClient)

        //ADMIN
        this.router
            .get('/am/waiting', authorization, this.admin.readCardWaiting)
            .get('/am', authorization, this.admin.readCard)
            .post('/am/config/new', authorization, validation(CashConfigCreate), this.admin.newCashConfig)
            .post('/am/accept', authorization, validation(AcceptCash), this.admin.acceptCash)
            .put('/am/config/:code', authorization, validation(CashConfigUpdate), this.admin.updateCashConfig)
            .delete('/am/config/:code', authorization, this.admin.deleteCashConfig)
    }

    private async readCashConfig(req: IRequest, res: IResponse, next: INextFunction) {
        try {
            let query = req.query;
            let response = await CashInController.getCashConfig(query);
            response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
        } catch (error) {
            API.serverError(req, res, error);
        }
    }

    //CLIENT
    private client = new class {

        async NewCashClient(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as NewCashClient;
                let { code } = req.user;
                let response = await CashInController.client.NewCashClient(data, code);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    };

    //ADMIN
    private admin = new class {

        async readCard(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let query = req.query;
                let response = await CashInController.getCash(query);
                response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async readCardWaiting(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let query = req.query;
                query['status'] = { $eq: ServerConfig.STATUS.WAITING };
                let response = await CashInController.getCash(query);
                response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async newCashConfig(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as CashConfigCreate;
                let response = await CashInController.admin.newCashConfig(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async updateCashConfig(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let data = req.body as CashConfigUpdate;
                let response = await CashInController.admin.updateCashConfig(code, data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async deleteCashConfig(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.params;
                let response = await CashInController.admin.deleteCashConfig(code);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async acceptCash(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as AcceptCash;
                let response = await CashInController.admin.acceptCash(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }
};
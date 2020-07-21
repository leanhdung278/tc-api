"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const Api_1 = require("../providers/Api");
const PermissionModel_1 = require("../models/PermissionModel");
/**
 * @step1 Get url method params query and format data
 * @step2 Check params query and set default
 * @step3 Check all information on the database
 */
function permission(options) {
    return (req, res, next) => {
        try {
            let { originalUrl, method, params, query } = req;
            let { permissionCode } = req.user;
            let { pathname } = url.parse(originalUrl);
            let permissionOdd = options || undefined;
            //Check params and query
            let keyp = Object.keys(params);
            let keyq = Object.keys(query);
            //Permission odd
            if (permissionOdd
                && Object.keys(permissionOdd).length) {
                pathname = permissionOdd.path;
                keyp = permissionOdd.params;
                keyq = permissionOdd.query;
                method = permissionOdd.method;
            }
            ;
            keyp = !keyp || !keyp.length ? ['none'] : keyp;
            keyq = !keyq || !keyq.length ? ['none'] : keyq;
            //Format query
            let queryc = [];
            keyq.map(key => {
                if (key == 'none' && !queryc.includes('none'))
                    queryc.push('none');
                if (key == 'limit' && !queryc.includes('limit'))
                    queryc.push('limit');
                if (key == 'offset' && !queryc.includes('offset'))
                    queryc.push('offset');
                if (typeof query[key] == 'object') {
                    if (query[key]['eq'] && !queryc.includes('eq'))
                        queryc.push('eq');
                    if (query[key]['gte'] && !queryc.includes('gte'))
                        queryc.push('gte');
                    if (query[key]['lte'] && !queryc.includes('lte'))
                        queryc.push('lte');
                    if (query[key]['sort'] && !queryc.includes('sort'))
                        queryc.push('sort');
                    if (query[key]['contains'] && !queryc.includes('contains'))
                        queryc.push('contains');
                }
            });
            keyp.map(key => pathname = pathname.replace(`/${params[key]}`, ''));
            PermissionModel_1.Permission
                .find({ isActive: true })
                .elemMatch('permission', { path: pathname, method: method })
                .findOne({ code: permissionCode, 'permission.params': { $all: keyp }, 'permission.query': { $all: queryc } })
                .exec((err, doc) => {
                if (!err && doc) {
                    //DONE
                    next();
                }
                else {
                    Api_1.API.forbidden(req, res, 'Not have access');
                }
            });
        }
        catch (error) {
            Api_1.API.serverError(req, res, error);
        }
    };
}
exports.default = permission;
//# sourceMappingURL=Permission.js.map
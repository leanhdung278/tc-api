import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { API } from '../providers/Api';

function validation<T>(type: any, skipMissingProperties: boolean = false) {
    return (req: IRequest, res: IResponse, next: INextFunction) => {
        validate(plainToClass(type, req.body), { skipMissingProperties, whitelist: true, forbidNonWhitelisted: true })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    let response = [];
                    errors.map((error: ValidationError) => response.push({ property: error.property, constraints: error.constraints }));
                    API.invalid(req, res, response);
                } else {
                    next();
                }
            });
    };
}

export default validation;

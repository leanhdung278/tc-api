import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

class Locals {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	public static config(): any {
		dotenv.config({ path: path.join(__dirname, '../../.env') });

		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 3000;
		const appSecret = process.env.APP_SECRET || 'du%$@hdah((*5tt';
		const mongooseUrl = process.env.MONGOOSE_URL;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || 50;

		const name = 'DUNGLA';
		const year = (new Date()).getFullYear();
		const copyright = `Copyright ${year} ${name} | All Rights Reserved`;

		const isCORSEnabled = process.env.CORS_ENABLED || false;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
		const apiPrefix = process.env.API_PREFIX || 'api';

		return {
			appSecret,
			apiPrefix,
			copyright,
			isCORSEnabled,
			jwtExpiresIn,
			maxUploadLimit,
			maxParameterLimit,
			mongooseUrl,
			name,
			port,
			url
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	public static init(_express: Application): Application {
		_express.locals.app = this.config();
		return _express;
	}
}

export default Locals;

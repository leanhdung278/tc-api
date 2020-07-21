import * as mongoose from 'mongoose';

import { MongoError } from 'mongodb';
import ServerConfig from '../configs/ServerConfig';
import Locals from './Locals';
import Log from '../middlewares/Log';

export class Database {

	// Initialize your database pool
	public static init(): any {
		const dsn = Locals.config().mongooseUrl;
		const options = { useNewUrlParser: true, useUnifiedTopology: true };

		mongoose.connect(dsn, options, (error: MongoError) => {
			// handle the error case
			if (error) {
				Log.info('Failed to connect to the Mongo server!!');
				console.log(error);
				throw error;
			} else {
				Log.info('connected to mongo server');
			}
		});

	}

	public static async get(model: string, query: any) {

		if (mongoose.modelNames().includes(model)) {

			let { limit, offset } = query;
			let schema = mongoose.model(model);

			//Set limit and offset
			let lm = Number(limit) || ServerConfig.LIMIT_DEFAULT;
			let os = Number(offset) || ServerConfig.OFFSET_DEFAULT;

			//Remove prototype limit and offset
			delete query['limit'];
			delete query['offset'];

			let keys = Object.keys(query);
			let sort = {};
			let filter = {
				isActive: {
					$eq: true
				}
			};

			//Map filter query
			keys.map(key => {
				if (typeof query[key] == 'object') {
					if (query[key]['sort'] && query[key]['sort'] == 'desc') sort[key] = -1;
					if (query[key]['sort'] && query[key]['sort'] == 'asc') sort[key] = 1;
					if (query[key]['eq']) filter[key] ? filter[key]['$eq'] = query[key]['eq'] : filter[key] = { $eq: query[key]['eq'] };
					if (query[key]['gte']) filter[key] ? filter[key]['$gte'] = query[key]['gte'] : filter[key] = { $gte: query[key]['gte'] };
					if (query[key]['lte']) filter[key] ? filter[key]['$lte'] = query[key]['lte'] : filter[key] = { $lte: query[key]['lte'] };
					if (query[key]['contains']) filter[key] ? filter[key]['$regex'] = query[key]['contains'] : filter[key] = { $regex: query[key]['contains'] };
				}
			})

			//Find
			let count = await schema.countDocuments(filter);
			let response = await schema.find(filter).skip(os).limit(lm).sort(sort);

			return {
				status: true,
				data: response,
				pagination: {
					totalRows: count,
					totalPages: Math.floor(count / lm)
				}
			};

		} else {
			return {
				status: false,
				data: 'This table does not exist',
				pagination: {
					totalRows: 0,
					totalPages: 0
				}
			};
		}

	}
}

export default mongoose;

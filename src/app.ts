import 'reflect-metadata'; // To enable @Decorators syntax
import config from './config';
import express from 'express';
import Logger from './loaders/logger';

async function startServer() {
	const app = express();
	await require('./loaders').default({ expressApp: app });

	app.listen(config.port, () => {
		Logger.info('[ SUCCESSFULLY LOADED CONFIGS ] %o',config);
		Logger.info(`Started server, listening on port ${config.port}
		`);
	}).on('error', err => {
		Logger.error(err);
		process.exit(1);
	});
}

startServer();

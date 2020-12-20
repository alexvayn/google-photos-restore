import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import MetadataService from '../../services/metadata'
import config from '../../config';

import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/archive', route);

  route.get('/media', (req: Request, res: Response) => {
    return res.json({ user: "nobody" }).status(200);
  });

  route.get(
    '/healthcheck',
    async (req: Request, res: Response, next) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Runing basic health check...');


      const healthcheck = {
        uptime: Math.floor(process.uptime()) + ' seconds',
        message: 'OK',
        timestamp: new Date().toLocaleString()
      };

      const metadataService = Container.get(MetadataService);
      await metadataService.healthCheck(healthcheck)
        .then((metadataResponse) => {
          logger.info('Response from Metadata Service: ' + metadataResponse)
          logger.info('Sending back healthcheck response:');
          logger.info('healthcheck: %o', healthcheck);
          res.send(healthcheck);
        }, (e) => {
          logger.error('error while listing metadata: %o', e);
          healthcheck.message = e;
          res.status(503).send();
        });
    },//leaving in this trailing comma because I can
  );

  route.get(
    '/fix',
    async (req: Request, res: Response, next) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Fixing the media file...');


      const metadataService = Container.get(MetadataService);
      await metadataService.fixDate(null)
        .then((metadataResponse) => {
          logger.info('Response from Metadata Service: %o', metadataResponse)
          res.send(metadataResponse);
        }, (e) => {
          logger.error('error while listing metadata: %o', e);
          res.status(503).send();
        });
    },//leaving in this trailing comma because I can
  );

};

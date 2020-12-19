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
        const logger:Logger = Container.get('logger');
        logger.debug('Runing basic health check...');
        //logger.debug(JSON.stringify(config));
        console.log(config);
        try {
          const metadataService = Container.get(MetadataService);
          await metadataService.listMetadata('testArg1', 'testArg2');
          return res.json({ result: "All health checks passed!" }).status(200);
        } catch (e) {
          logger.error('error: %o',  e );
          return next(e);
        }
      },
    );

};

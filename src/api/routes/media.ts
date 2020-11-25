import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import MetadataService from '../../services/metadata'

//import middlewares from '../middlewares';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/media', (req: Request, res: Response) => {
    return res.json({ user: "nobody" }).status(200);
  });

  route.get(
      '/test',
      async (req: Request, res: Response, next: NextFunction) => {
        const logger:Logger = Container.get('logger');
        logger.debug('Calling service with body: %o', req.body);
        try {
          const metadataService = Container.get(MetadataService);
          await metadataService.listMetadata('testArg1', 'testArg2');
          //const { email, password } = req.body;
          //const authServiceInstance = Container.get(AuthService);
          //const { user, token } = await authServiceInstance.SignIn(email, password);
          return res.json({ result: "Pass" }).status(200);
        } catch (e) {
          logger.error('error: %o',  e );
          return next(e);
        }
      },
    );

};

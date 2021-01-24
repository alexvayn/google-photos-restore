import { Container, ContainerInstance } from 'typedi';
import LoggerInstance from './logger';
import config from '../config';

export default ({ models }: { models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
      LoggerInstance.info('Checking injection of [%s] : %o', m.name, Container.has(m.name));
    });

    Container.set('logger', LoggerInstance);
    LoggerInstance.info('Checking injection of [logger] : %o', Container.has('logger'));
    LoggerInstance.info('Injected everything into container', Container.has('logger'));

  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};

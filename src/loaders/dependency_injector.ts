import { Container } from 'typedi';
import LoggerInstance from './logger';
//import agendaFactory from './agenda';
import config from '../config';
import mailgun from 'mailgun-js';

export default ({ models }: { models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);
    LoggerInstance.info('Injected everything into container');

  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};

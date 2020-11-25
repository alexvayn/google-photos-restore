import expressLoader from './express';
import dependencyInjectorLoader from './dependency_injector';
import Logger from './logger';
import './events';

export default async ({ expressApp }) => {

  const mediaFileModel = {
    name: 'mediaFileModel',
    model: require('../models/media_file').default
  }

  await dependencyInjectorLoader({
    models: [
      mediaFileModel
    ]
  });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
}

import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { Logger } from 'winston';

@EventSubscriber()
export default class UserSubscriber {

  @On(events.mediaFile.metaDataLoaded)
  public onMetaDataLoaded() {
    const Logger: Logger = Container.get('logger');

    try {
   /**
    * @TODO implement this
    */
    } catch (e) {
      Logger.error(`Error on event ${events.mediaFile.metaDataLoaded}: %o`, e);

      // Throw the error so the process dies (check src/app.ts)
      throw e;
    }
  }
}

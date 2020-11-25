import { Service, Inject } from 'typedi';
//import { Logger } from 'winston';


@Service()
export default class MetaDataService {
  constructor(
    @Inject('logger') private logger
  ) {

  }

  public async listMetadata(mediaFile, metadata) {
    this.logger.debug(`listing metadata for ${mediaFile} and ${metadata}`);
  }
}

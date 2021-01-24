import { Service, Inject } from 'typedi';
import fs from 'fs';
import { ExifParserFactory } from "ts-exif-parser";
const { close, open, utimes } = require('fs');
import { DateTime } from "luxon";


//@TODO just "touch" the file with a forced timestamp: https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/


@Service()
export default class MetadataService {
  constructor(
    @Inject('logger') private logger
  ) {

  }

  public async healthCheck(healthcheck) {
    healthcheck.metaDataServiceStatus = 'OK';
    return 'this is fine -_-';
  }

  public async fixDate(filePath) {

    const metadataPath = filePath + '.json';
    this.logger.debug(`Reading metadata file ${metadataPath}`);

    // The original photo is taken at 2017:11:19 08:47:19
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    //  const exifData = getExif(originalFile).Exif; //=> '2017:11:19 08:47:19'

    this.logger.debug('Metadata loaded:\n %o', metadata);
    
    const photoTakenTime = metadata.photoTakenTime;
    this.logger.debug('photoTakenTime: %o', photoTakenTime);

    /**
     * TODO: Fix the date right here using fs.utimes (see fixDateWithExif)
     */

    return 'Done fixing date';

  }



  /**
   * @deprecated
   * @param filePath full file path
   */
  public async fixDateWithExif(filePath) {

    this.logger.debug(`Reading original file ${filePath}`);

    
    const originalFile = fs.readFileSync(filePath);
    //  const exifData = getExif(originalFile).Exif; //=> '2017:11:19 08:47:19'

    
    const parser = ExifParserFactory.create(originalFile);
    
    
    parser.enableSimpleValues(false);
    const exifData = parser.parse();

     /**
     * 
     * WARNING: this is hacky and risky, but seems to be the only way of exracting the timezone, 
     * which unfortunately has the tag 'undefined'. Better than nothing (for now)
     */
    var timezoneOffset = exifData['tags']['undefined'];
    this.logger.debug(`timezoneOffset: ${timezoneOffset}`);
    if(!timezoneOffset) {
      this.logger.warn('No timezone available. Defaulting to GMT-4');
      timezoneOffset = '-04:00';
    }

    // Date format: '2020:09:07 18:58:22'
    const originalDateString = exifData['tags']['DateTimeOriginal'] + ' ' + timezoneOffset;
    this.logger.debug(`originalDateString (offset appended): ${originalDateString}`);
    const originalDateWithZone = DateTime.fromFormat(
      originalDateString,
      "yyyy:MM:dd HH:mm:ss ZZ"
    );
    
    this.logger.debug('originalDateWithZone: %s',originalDateWithZone.toLocaleString(DateTime.DATETIME_FULL));

    const touch = (path, callback) => {
      utimes(path, originalDateWithZone.toJSDate(), originalDateWithZone.toJSDate(), err => {
        if (err) {
          return open(path, 'w', (err, fd) => {
            err ? callback(err) : close(fd, callback);
          });
        }
        callback();
      });
    };

    touch(filePath, err => {
      if (err) throw err;
      console.log(`touch ${filePath}`);
    });

    return exifData;

  }
}

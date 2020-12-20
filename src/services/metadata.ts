import { Service, Inject } from 'typedi';
import config from '../config';
import fs from 'fs';
import {ExifParserFactory} from "ts-exif-parser";
const { close, open, utimes } = require('fs');

import exiftool from 'node-exiftool';
import exiftoolBin from 'dist-exiftool';

import { format, compareAsc } from 'date-fns';


//@TODO just "touch" the file with a forced timestamp: https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/


@Service()
export default class MetadataService {
  constructor(
    @Inject('logger') private logger
  ) {

  }

  public async healthCheck(healthcheck){
    healthcheck.metaDataServiceStatus = 'OK';
    return 'this is fine -_-';
  }


  public async fixDate(filePath) {

    // The original photo is taken at 2017:11:19 08:47:19
    const originalFile =  fs.readFileSync(config.testImagePath);
  //  const exifData = getExif(originalFile).Exif; //=> '2017:11:19 08:47:19'

    this.logger.debug(`successfully read file ${config.testImagePath}`);

    const parser = ExifParserFactory.create(originalFile);
    //parser.enableSimpleValues(false);
    const exifData = parser.parse();

    console.log(exifData['tags']);

    const date = exifData['tags']['DateTimeOriginal'];
    this.logger.debug(`DateTimeOriginal: ${new Date(date*1000)}` );
    this.logger.debug(`DateTimeOriginal: ${date}` );

    /**
     * 
     * KNOWN BUG: doesn't take into account time zone (which has 'undefined' tag)
     */

    const touch = (path, callback) => {
      utimes(path, date, date, err => {
        if (err) {
          return open(path, 'w', (err, fd) => {
            err ? callback(err) : close(fd, callback);
          });
        }
        callback();
      });
    };

    touch(config.testImagePath, err => {
      if (err) throw err;
      console.log(`touch ${config.testImagePath}`);
    });

    return exifData;


    
    //const DateTimeOriginal = format(new Date(exifData.tags.DateTimeOriginal*1000), 'yyyy:mm:dd HH:MM:SS');
    //const CreateDate = format(new Date(exifData.tags.CreateDate*1000), 'yyyy:mm:dd HH:MM:SSXXX');

    //console.log(DateTimeOriginal);
    //console.log(CreateDate);





    

    //const newFile = modifyExif(await readFile(config.archiveRootDir+'/example.jpg'), data => {
      // 36867: tag ID of `DateTimeOriginal` tag
    //  data.Exif['36867'] = '2018:06:15 12:00:00'
  //  });

  //  getExif(newFile).Exif; //=> '2018:06:15 12:00:00'

    //this.logger.debug(`listing metadata for ${config.archiveRootDir}`);

  }
}

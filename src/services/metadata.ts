import { Service, Inject } from 'typedi';
import config from '../config';
import fs from 'fs';
import {ExifParserFactory} from "ts-exif-parser";

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

  public async listMetadata(mediaFile, metadata) {

    // The original photo is taken at 2017:11:19 08:47:19
    const fileName = config.testImagePath;
    const originalFile =  fs.readFileSync(fileName);
  //  const exifData = getExif(originalFile).Exif; //=> '2017:11:19 08:47:19'

    const parser = ExifParserFactory.create(originalFile);
    const exifData = ExifParserFactory.create(originalFile).parse();

    //const date = exifData['tags']['DateTimeOriginal'];
    //console.log(`DateTimeOriginal: ${new Date(DateTimeOriginal*1000)}` );
    const DateTimeOriginal = format(new Date(exifData.tags.DateTimeOriginal*1000), 'yyyy:mm:dd HH:MM:SS');
    const CreateDate = format(new Date(exifData.tags.CreateDate*1000), 'yyyy:mm:dd HH:MM:SSXXX');

    //console.log(DateTimeOriginal);
    //console.log(CreateDate);
    const ep = new exiftool.ExiftoolProcess(exiftoolBin)


    this.logger.debug(
      `successfully read file: ${fileName}
       listing metadata...
    `);
    console.log(exifData);

  }
}

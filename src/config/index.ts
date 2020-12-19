import dotenv from 'dotenv';

const envExists = dotenv.config();
if (envExists.error) {
  throw new Error(".env file does not exist...create one in the project root directory");
}

export default {
  port: parseInt(process.env.PORT, 10),
  archiveRootDir: process.env.ARCHIVE_ROOT,
  trashDir: process.env.TRASH_DIR,
  metaDataArchivePath: process.env.META_ARCHIVE_DIR,
  testImagePath: process.env.TEST_IMAGE_PATH,
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  api: {
    prefix: '/api'
  },
  healthCheckEndpoint: getHealthCheckEndpoint()
};

function getHealthCheckEndpoint() {
  return 'http://localhost:' + parseInt(process.env.PORT, 10) + '/api/archive/healthcheck';
}
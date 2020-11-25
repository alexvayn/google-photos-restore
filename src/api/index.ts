import { Router } from 'express';
import media from './routes/media';

export default () => {
  const app = Router();
  media(app);
  return app
}

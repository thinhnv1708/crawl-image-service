import * as Joi from 'joi';
import { ICrawlImageBody } from '../crawlImageBody.dto';

export const crawlImageBodyJoiSchema = Joi.object<ICrawlImageBody>({
  source: Joi.string().required(),
  category: Joi.string().required(),
  fileType: Joi.string().required(),
  width: Joi.number().allow(null),
  height: Joi.number().allow(null),
});

import qs from 'qs'
import { StandardError } from './error-handling';
import { logger } from '../logger';

const parseBody = (requestBody: string): Record<any, any> => {
  try {
    return JSON.parse(requestBody);
  } catch (e1) {
    try {
      const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

      if (base64regex.test(requestBody)) {
        return qs.parse(Buffer.from(requestBody, 'base64').toString('ascii'));
      }

      return qs.parse(requestBody);
    } catch (e2) {
      logger.error('Failed to parse body', { requestBody, error: e2 });

      throw new StandardError('Body is not valid', 'CLIENT_ERROR', 400);
    }
  }
}

export default parseBody;

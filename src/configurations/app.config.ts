import { convertEnvNumber } from '@utils/index';
import { IAppConfig } from './interfaces';

export default (): {
  APP_CONFIG: IAppConfig;
} => ({
  APP_CONFIG: {
    SERVICE_TAG: process.env.SERVICE_TAG || 'NkcSyncWorker',
    PORT: convertEnvNumber(process.env.PORT) ?? 3000,
    UPLOAD_DESTINATION: process.env.UPLOAD_DESTINATION,
  },
});

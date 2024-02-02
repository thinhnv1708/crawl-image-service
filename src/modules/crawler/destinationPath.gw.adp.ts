import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class DestinationPathGwAdp {
  getDesticationPath(category: string, fileType: string): string {
    const now = dayjs();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    return `/${category}/${now.format('YYYYMMDD')}/${now.format('YYYYMMDDHH')}/${uniqueSuffix}.${fileType}`;
  }
}

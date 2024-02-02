import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DowloadImageGwAdp {
  constructor(private readonly httpService: HttpService) {}

  async dowloadImage(source: string, destinationPath: string): Promise<void> {
    const response = await lastValueFrom(
      this.httpService.get(source, {
        responseType: 'stream',
      }),
    );

    const writableStream = fs.createWriteStream(destinationPath);

    response.data.pipe(writableStream);

    return new Promise((resolve, reject) => {
      writableStream.on('finish', () => {
        resolve();
      });

      writableStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

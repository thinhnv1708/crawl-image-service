import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class ResizeImageGwAdp {
  resizeImage(
    input: string,
    ouput: string,
    width: number,
    height: number,
  ): Promise<void> {
    const readableStream = fs.createReadStream(input);
    const writableStream = fs.createWriteStream(ouput);

    readableStream.pipe(sharp().resize(width, height)).pipe(writableStream);

    return new Promise((resolve, reject) => {
      writableStream.on('finish', () => {
        resolve();
      });

      readableStream.on('error', (err) => {
        reject(err);
      });

      writableStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

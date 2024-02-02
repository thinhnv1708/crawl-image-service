import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class RemoveImageGwAdp {
  remove(path: string): void {
    try {
      fs.unlinkSync(path);
    } catch (error) {
      return;
    }
  }
}

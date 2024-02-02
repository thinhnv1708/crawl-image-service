import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CreateDirGwAdp {
  mkdir(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
}

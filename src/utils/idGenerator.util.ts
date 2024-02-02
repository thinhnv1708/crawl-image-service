import { customAlphabet } from 'nanoid';
const defaultAlphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const defaultLength = 10;

export const idGenerator = (
  alphabet: string = defaultAlphabet,
  length: number = defaultLength,
): string => customAlphabet(alphabet, length)();
  
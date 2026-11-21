import english from './locales/en.json';

export type TextKey = keyof typeof english;

export function text(key: TextKey): string {
  return english[key];
}

import { writeImage, writeText } from '@tauri-apps/plugin-clipboard-manager';
import { clsx } from 'clsx';
import moment from 'moment';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';
import type { Image } from '@tauri-apps/api/image';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

interface CookieAttributes {
  'Max-Age': string;
  'Path': string;
  'Expires': string;
  'HttpOnly': boolean;
  'SameSite': string;
}

export const parseCookie = <T extends string>(cookie: string) => {
  return Object.fromEntries(
    cookie
      .split(';')
      .map((segment) => {
        return segment
          .trim()
          .split('=')
          .map(decodeURIComponent);
      }),
  ) as { [K in T]: string } & CookieAttributes;
};

export const sample = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const normalizeSymbols = (str: string) => {
  return str
    .replace(/∗/g, '*')
    .replace(/＂/g, '"')
    .replace(/＃/g, '#')
    .replace(/＠/g, '@')
    .replace(/／/g, '/')
    .replace(/＋/g, '+');
};

export const applyCookie = (...cookies: (string | null)[]) => {
  sessionStorage.setItem('cookie', cookies.filter(Boolean).join(';'));
  sessionStorage.setItem('auth', cookies.find((v) => v?.startsWith('auth'))?.split('=')[1] ?? '');
};

export const copy = async (content: string | Image | Uint8Array | ArrayBuffer | number[]) => {
  if (typeof content == 'string') {
    await writeText(content);
    toast.success('Copied to clipboard', {
      description: content,
    });
    return;
  }

  await writeImage(content);
};

export const yyyyMMddHHmmss = (timestamp: string) => moment(timestamp).format('yyyy/MM/DD HH:mm:ss');

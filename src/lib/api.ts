import { invoke } from '@tauri-apps/api/core';

import { getCredentialStore } from './stronghold';

import type { CurrentUser, LimitedUser, User } from './models/user';
import type { FavoriteGroup, FavoriteWorld } from './models/favorite';
import type { Instance, World } from './models/world';
import type { File } from './models/file';
import type { Require2FA } from './models/require-2fa';
import type { Status } from '@/components/user/status-badge';

export interface APIError {
  error: {
    message: string;
    status_code: number;
  };
}

export class APIFetchError extends Error {
  endpoint: string;
  init: RequestInit;
  response: Response;

  constructor(endpoint: string, init: RequestInit, response: Response) {
    super(`Request failed with status ${response.status}, endpoint: ${endpoint}`);
    this.endpoint = endpoint;
    this.init = init;
    this.response = response;
  }

  get status() {
    return this.response.status;
  }
}

interface BasicRequest extends RequestInit {
  url: string;
}

interface BasicResponse {
  status: number;
  status_text: string;
  headers: Record<string, string>;
  body: string;
}

type RequestResponse<T = unknown> = Promise<{
  response: Response;
  data: T;
}>;

const requestCache = new Map<string, RequestResponse>();

const getRequestKey = (endpoint: string, init?: RequestInit) => {
  let key = endpoint;

  if (typeof init?.body == 'string') {
    key += ':';
    key += new URLSearchParams(JSON.parse(init.body) as Record<string, string>).toString();
  }

  return key;
};

function request<T>(endpoint: string, init?: RequestInit): RequestResponse<T> {
  const key = getRequestKey(endpoint, init);
  let promise = requestCache.get(key) as RequestResponse<T> | undefined;

  if (promise) return promise;

  promise = (async () => {
    const authCookie = sessionStorage.getItem('cookie') ?? '';

    const req = {
      url: `https://api.vrchat.cloud/api/1${endpoint}`,
      method: init?.method ?? 'GET',
      ...init,
      headers: {
        ...init?.headers,
        'Cookie': authCookie,
        'User-Agent': 'VRCBook/0.1.0 (hello@kamiya.app)',
      },
    } satisfies BasicRequest;

    const responseData = await invoke<BasicResponse>('request', { request: req });

    const res = new Response(responseData.body, {
      status: responseData.status,
      statusText: responseData.status_text,
      headers: new Headers(responseData.headers),
    });

    if (!res.ok) {
      throw new APIFetchError(endpoint, req, res);
    }

    window.setTimeout(() => requestCache.delete(key), 30_000);

    return {
      response: res,
      data: await res.json() as T,
    };
  })();

  requestCache.set(key, promise);

  return promise;
}

export async function login(options?: { email: string; password: string }) {
  const { response, data } = await request<Require2FA | CurrentUser>('/auth/user', {
    ...(options && {
      headers: {
        Authorization: `Basic ${btoa(`${encodeURI(options.email)}:${encodeURI(options.password)}`)}`,
      },
    }),
  });

  const cookieString = response.headers.get('set-cookie');

  if (cookieString) {
    await getCredentialStore().insertRecord('currentAuth', encodeURIComponent(cookieString));
  }

  return data;
};

interface Verify2FAOptions {
  type: 'totp' | 'otp' | 'emailotp';
  code: string;
}

const instanceCache = new Map<string, Instance>();

export async function verify2FA(options: Verify2FAOptions) {
  const endpoint = {
    totp: '/auth/twofactorauth/totp/verify',
    otp: '/auth/twofactorauth/otp/verify',
    emailotp: '/auth/twofactorauth/emailotp/verify',
  }[options.type];

  const { response, data } = await request<{ verified: boolean }>(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ code: options.code }),
  });

  const cookieString = response.headers.get('set-cookie');

  if (cookieString) {
    await getCredentialStore().insertRecord('current2FA', encodeURIComponent(cookieString));
  }

  return data;
};

export async function getUserById(userId: string) {
  const { data } = await request<User>(`/users/${userId}`);

  return data;
};

export async function getWorldById(worldId: string) {
  const { data } = await request<World>(`/worlds/${worldId}`);

  return data;
};

export async function getWorldInstance(worldId: string, instanceId: string) {
  const { data } = await request<Instance>(`/worlds/${worldId}/${instanceId}`);

  return data;
};

export async function getInstance(location: string) {
  if (instanceCache.has(location)) {
    return instanceCache.get(location)!;
  }

  const { data } = await request<Instance>(`/instances/${location}`);
  instanceCache.set(location, data);

  return data;
};

interface UpdateUserRequest {
  email: string;
  birthday: string;
  acceptedTOSVersion: number;
  tags: string[];
  status: Status;
  statusDescription: string;
  bio: string;
  bioLinks: string[];
  pronouns: string;
  isBoopingEnabled: boolean;
  userIcon: string;
}

export async function updateUserInfo(userId: string, info: Partial<UpdateUserRequest>) {
  const { data } = await request<CurrentUser>(`/users/${userId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(info),
  });

  return data;
};

export async function getFriends() {
  const all: LimitedUser[] = [];
  let offline = false;
  const fetch = async () => {
    let current: LimitedUser[];
    let offset = 0;

    do {
      const { data } = await request<LimitedUser[]>(`/auth/user/friends?n=100&offset=${offset}&offline=${offline}`);
      current = data;
      all.push(...data);
      offset += data.length;
    } while (current.length == 100);
  };
  await fetch();
  offline = true;
  await fetch();

  return all.filter((val, i, a) => a.findIndex((v) => v.id == val.id) == i);
};

export async function getWorldFavorites() {
  const { data } = await request<FavoriteWorld[]>('/worlds/favorites?n=100');

  return data;
};

export async function getFavoriteGroups() {
  const { data } = await request<FavoriteGroup[]>('/favorite/groups?n=100');

  return data;
};

export async function getGalleryPrints() {
  const { data } = await request<File[]>('/files?tag=print&n=100');

  return data;
};

export async function getGalleryPhotos() {
  const { data } = await request<File[]>('/files?tag=gallery&n=100');

  return data;
};

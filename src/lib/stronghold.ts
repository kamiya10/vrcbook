import { Stronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir } from '@tauri-apps/api/path';

import type { Client, Store } from '@tauri-apps/plugin-stronghold';

let stronghold: Stronghold, client: Client;

export const initStronghold = async () => {
  if (import.meta.env.DEV) {
    return localStorage;
  }

  if (stronghold && client) {
    return {
      stronghold,
      client,
    };
  }

  const vaultPath = `${await appDataDir()}/vault.hold`;
  const vaultPassword = import.meta.env.VITE_VAULT_PASS;

  stronghold = await Stronghold.load(vaultPath, vaultPassword);

  const clientName = 'creds';

  try {
    client = await stronghold.loadClient(clientName);
  }
  catch {
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};

export const insertRecord = async (store: Store, key: string, value: string) => {
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
  await stronghold.save();
};

export const getRecord = async (store: Store, key: string): Promise<string | null> => {
  const data = await store.get(key);

  if (!data) return null;

  return new TextDecoder().decode(new Uint8Array(data));
};

export const getCredentialStore = () => {
  if (import.meta.env.DEV) {
    return {
      insert: (key: string, value: string) => localStorage.setItem(key, value),
      insertRecord: (key: string, value: string) => localStorage.setItem(key, value),
      get: (key: string) => localStorage.getItem(key),
      getRecord: (key: string) => localStorage.getItem(key),
      save: () => Promise.resolve(),
    };
  }

  if (stronghold && client) {
    const store = client.getStore();
    return Object.assign(store, {
      insertRecord: (key: string, value: string) => insertRecord(store, key, value),
      getRecord: (key: string) => getRecord(store, key),
    });
  }

  throw new Error('Stronghold is not initialized');
};

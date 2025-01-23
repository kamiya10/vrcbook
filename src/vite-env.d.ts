/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VAULT_PASS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

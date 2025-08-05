/// <reference types="vite/client" />

interface Window {
  __TAURI__: {
    invoke: (command: string, args?: any) => Promise<any>;
  };
} 
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'invoice.ventureinnovo.com',
  appName: 'Invoice App',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;

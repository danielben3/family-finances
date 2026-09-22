import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familyfinances.app',
  appName: 'ניהול פיננסי משפחתי',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

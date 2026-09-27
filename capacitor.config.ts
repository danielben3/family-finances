import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familyfinances.app',
  appName: 'ניהול פיננסי משפחתי',
  webDir: 'dist',
  server: {
    url: 'https://danielben3.github.io/family-finances/',
    cleartext: false,
    androidScheme: 'https'
  }
};

export default config;

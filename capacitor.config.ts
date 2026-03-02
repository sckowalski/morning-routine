import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sckowalski.morningspeedrun',
  appName: 'Morning Speedrun',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;

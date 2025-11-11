interface EnvironmentVariables {
  readonly EXPO_PUBLIC_KEY_ENCODE_STORAGE: string
  readonly EXPO_PUBLIC_EXPO_NOTIFICATION_PROJECT_ID: string
  readonly EXPO_PUBLIC_MODE: string
  readonly EXPO_PUBLIC_MORALIS_API_KEY: string
  readonly EXPO_PUBLIC_ETHER_SCAN_API_KEY: string
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables { }
}

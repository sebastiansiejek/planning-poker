import type { DatabaseProvider } from '@/shared/types/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUSHER_APP_ID: string;
      NEXT_PUBLIC_PUSHER_KEY: string;
      PUSHER_SECRET: string;
      NEXT_PUBLIC_PUSHER_CLUSTER: string;
      NEXT_PUBLIC_FIREBASE_API_KEY?: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
      NEXT_PUBLIC_FIREBASE_APP_ID?: string;
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
      FIREBASE_DATABASE_URL?: string;
      FIREBASE_CLIENT_EMAIL?: string;
      FIREBASE_PRIVATE_KEY?: string;
      DATABASE_PROVIDER: DatabaseProvider;
    }
  }
}

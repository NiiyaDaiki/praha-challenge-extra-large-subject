declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string;
    readonly NEXT_PUBLIC_FIREBASE_APIKEY?: string;
    readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
    readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
    readonly NEXT_PUBLIC_FIREBASE_STRAGE_BUCKET?: string;
    readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly NEXT_PUBLIC_FIREBASE_APP_ID?: string;
  }
}



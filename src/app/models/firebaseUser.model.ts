export interface FirebaseUser {
    uid: string;
    email?: string;
    emailVerified: boolean;
    displayName?: string;
    phoneNumber?: string;
    photoURL?: string;
    providerId: string;
    creationTime?: string;
    lastSignInTime?: string;
    isAnonymous: boolean;
    [key: string]: any;
  }
  
  export function getDefaultFirebaseUser(): FirebaseUser {
    return {
      uid: "",
      email: "",
      emailVerified: false,
      displayName: "",
      phoneNumber: "",
      photoURL: "",
      providerId: "",
      creationTime: "",
      lastSignInTime: "",
      isAnonymous: false,
    };
  }
  
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebaseConfig';

export type UserProfile = {
  username?: string;
  role: string;
  companyID?: string;
  isActive: boolean;
};

export async function getActiveUserProfile(
  user: User
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error('USER_PROFILE_NOT_FOUND');
  }

  const profile = userSnapshot.data();

  if (profile.isActive !== true) {
    throw new Error('ACCOUNT_DISABLED');
  }

  if (typeof profile.role !== 'string') {
    throw new Error('INVALID_USER_ROLE');
  }

  return {
    username: profile.username,
    role: profile.role === 'admin' ? 'superAdmin' : profile.role,
    companyID: profile.companyID,
    isActive: true,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {
    return await getActiveUserProfile(credential.user);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function resetUserPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export { auth, onAuthStateChanged, signOut };

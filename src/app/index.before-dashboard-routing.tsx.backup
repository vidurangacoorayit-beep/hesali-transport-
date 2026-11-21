import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import LoginScreen from '../pages/LoginScreen';
import {
  auth,
  onAuthStateChanged,
  signOut,
  loginUser,
  resetUserPassword,
  getActiveUserProfile,
  type UserProfile,
} from '../services/authService';

export default function Index() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (active) {
          setProfile(null);
          setChecking(false);
        }
        return;
      }

      setChecking(true);

      getActiveUserProfile(user)
        .then((userProfile) => {
          if (active) {
            setProfile(userProfile);
            setAuthError('');
            setChecking(false);
          }
        })
        .catch(async () => {
          await signOut(auth);

          if (active) {
            setProfile(null);
            setAuthError('Your account is inactive or your profile is unavailable.');
            setChecking(false);
          }
        });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Checking your account...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <LoginScreen
        onLogin={async (email, password) => {
          await loginUser(email, password);
        }}
        onResetPassword={async (email) => {
          await resetUserPassword(email);
        }}
      />
    );
  }

  const roleName = {
    superAdmin: 'Super Admin',
    manager: 'Manager',
    accountant: 'Accountant',
    driver: 'Driver',
    helper: 'Helper',
  }[profile.role] || profile.role;

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Hesali Transport</Text>
      <Text style={styles.heading}>Welcome, {profile.username || roleName}</Text>
      <Text style={styles.message}>Role: {roleName}</Text>
      <Text style={styles.message}>Company: {profile.companyID || 'Not assigned'}</Text>
      <Text style={styles.notice}>
        Your login is successful. Your dashboard is being prepared.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => signOut(auth)}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#17365d',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  notice: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    marginTop: 28,
    backgroundColor: '#17365d',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

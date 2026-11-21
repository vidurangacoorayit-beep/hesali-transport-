import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  onLogin: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
};

export default function LoginScreen({ onLogin, onResetPassword }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Email සහ Password දෙකම ඇතුළත් කරන්න.');
      return;
    }

    setLoading(true);
    setError('');
    setResetMessage('');

    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      const details = err as { code?: string; message?: string };
      setError(`Login Error: ${details.code || details.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Password Reset කිරීමට මුලින් Email Address එක ඇතුළත් කරන්න.');
      return;
    }

    setResetLoading(true);
    setError('');
    setResetMessage('');

    try {
      await onResetPassword(email.trim());
      setResetMessage('Password Reset Link එක ඔබගේ Email එකට යැව්වා. Inbox එක පරීක්ෂා කරන්න.');
    } catch {
      setError('Reset Email යැවීමට නොහැකි වුණා. Email Address එක පරීක්ෂා කරන්න.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/hesali-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>HESALI TRANSPORT</Text>
          <Text style={styles.subtitle}>Fleet Management System</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.description}>
            ඔබගේ ගිණුමට ඇතුළු වන්න
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading && !resetLoading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            editable={!loading && !resetLoading}
            onSubmitEditing={handleLogin}
          />

          <Pressable
            style={styles.forgotButton}
            onPress={handleResetPassword}
            disabled={loading || resetLoading}
          >
            {resetLoading ? (
              <ActivityIndicator size="small" color="#0047AB" />
            ) : (
              <Text style={styles.forgotText}>මුරපදය අමතකද? (Forgot Password?)</Text>
            )}
          </Pressable>

          {!!error && <Text style={styles.error}>{error}</Text>}
          {!!resetMessage && <Text style={styles.success}>{resetMessage}</Text>}

          <Pressable
            style={[styles.button, loading && styles.disabled]}
            onPress={handleLogin}
            disabled={loading || resetLoading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>ඇතුල් වන්න</Text>
            )}
          </Pressable>

          <Text style={styles.footer}>
            Secure access • Hesali Transport
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 5,
  },
  header: {
    backgroundColor: '#0047AB',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#FFB347',
    marginTop: 7,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    padding: 26,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#172554',
  },
  description: {
    color: '#64748B',
    marginTop: 6,
    marginBottom: 24,
  },
  label: {
    color: '#334155',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#0F172A',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 4,
  },
  forgotText: {
    color: '#0047AB',
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#0047AB',
    padding: 16,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 26,
    minHeight: 54,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  error: {
    color: '#DC2626',
    marginTop: 14,
  },
  success: {
    color: '#15803D',
    marginTop: 14,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 22,
  },
});

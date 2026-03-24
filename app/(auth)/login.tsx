import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';

export default function LoginScreen() {
  const { sendOtp } = useAuth();
  const { colors, isDark } = useTheme();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = makeStyles(colors, isDark);

  async function handleSendOtp() {
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 11 || !cleaned.startsWith('01')) {
      setError('সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { referenceNo } = await sendOtp(cleaned);
      router.push({ pathname: '/(auth)/verify', params: { mobile: cleaned, referenceNo } });
    } catch (e: any) {
      setError(e.message || 'ওটিপি পাঠানো ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>রূপান্তর</Text>
          </View>
          <Text style={styles.appTitle}>ইউনিট রূপান্তরকারী</Text>
          <Text style={styles.appSubtitle}>সহজে যেকোনো একক রূপান্তর করুন</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>মোবাইল নম্বর</Text>
          <View style={[styles.inputWrapper, error ? { borderColor: colors.error } : {}]}>
            <Text style={styles.prefix}>+৮৮</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={t => { setMobile(t); setError(''); }}
              placeholder="01XXXXXXXXX"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
              maxLength={11}
              autoFocus
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleSendOtp}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>ওটিপি পাঠান</Text>
            }
          </TouchableOpacity>

          <Text style={styles.termsText}>
            লগইন করে আপনি আমাদের ব্যবহারের শর্তাবলী মেনে নিচ্ছেন
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 96, height: 96, borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: { fontFamily: 'Hind-Siliguri-Bold', fontSize: 18, color: '#fff', letterSpacing: 1 },
  appTitle: { fontFamily: 'Hind-Siliguri-Bold', fontSize: 26, color: colors.text, marginBottom: 6 },
  appSubtitle: { fontFamily: 'Hind-Siliguri-Regular', fontSize: 15, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  label: { fontFamily: 'Hind-Siliguri-SemiBold', fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, overflow: 'hidden',
    backgroundColor: colors.surfaceSecondary,
  },
  prefix: {
    fontFamily: 'Hind-Siliguri-Medium', fontSize: 16, color: colors.textSecondary,
    paddingHorizontal: 14, paddingVertical: 14,
    borderRightWidth: 1, borderRightColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 14,
    fontFamily: 'Hind-Siliguri-Regular', fontSize: 17, color: colors.text,
  },
  errorText: { fontFamily: 'Hind-Siliguri-Regular', fontSize: 13, color: colors.error, marginTop: 8 },
  btn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { fontFamily: 'Hind-Siliguri-Bold', fontSize: 17, color: '#fff' },
  termsText: {
    fontFamily: 'Hind-Siliguri-Regular', fontSize: 12,
    color: colors.textTertiary, textAlign: 'center', marginTop: 16,
  },
});

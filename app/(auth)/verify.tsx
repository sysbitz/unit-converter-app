import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';

export default function VerifyScreen() {
  const { mobile, referenceNo } = useLocalSearchParams<{ mobile: string; referenceNo: string }>();
  const { verifyOtp, sendOtp } = useAuth();
  const { colors, isDark } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [currentRef, setCurrentRef] = useState(referenceNo);
  const inputs = useRef<TextInput[]>([]);
  const styles = makeStyles(colors, isDark);

  function handleChange(text: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    setError('');
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  }

  async function handleVerify() {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      setError('৬ সংখ্যার ওটিপি দিন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyOtp(otpStr, currentRef, mobile);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'ওটিপি যাচাই ব্যর্থ');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      const { referenceNo: newRef } = await sendOtp(mobile);
      setCurrentRef(newRef);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← ফিরে যান</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>🔐</Text>
        </View>
        <Text style={styles.title}>ওটিপি যাচাই করুন</Text>
        <Text style={styles.subtitle}>
          +৮৮{mobile} নম্বরে পাঠানো ৬ সংখ্যার কোডটি দিন
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => { if (r) inputs.current[i] = r; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : {}, error ? styles.otpBoxError : {}]}
              value={digit}
              onChangeText={t => handleChange(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleVerify}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>যাচাই করুন</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendRow}>
          {resending
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Text style={styles.resendText}>ওটিপি পাননি? <Text style={styles.resendLink}>পুনরায় পাঠান</Text></Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { padding: 20, paddingTop: 56 },
  backText: { fontFamily: 'Hind-Siliguri-Medium', fontSize: 15, color: colors.primary },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  iconBadge: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  iconText: { fontSize: 36 },
  title: { fontFamily: 'Hind-Siliguri-Bold', fontSize: 24, color: colors.text, marginBottom: 10 },
  subtitle: {
    fontFamily: 'Hind-Siliguri-Regular', fontSize: 14,
    color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32,
  },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  otpBox: {
    width: 48, height: 56, borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.border, textAlign: 'center',
    fontFamily: 'Hind-Siliguri-Bold', fontSize: 22, color: colors.text,
    backgroundColor: colors.surfaceSecondary,
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  otpBoxError: { borderColor: colors.error },
  errorText: { fontFamily: 'Hind-Siliguri-Regular', fontSize: 13, color: colors.error, marginBottom: 12 },
  btn: {
    width: '100%', backgroundColor: colors.primary, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnText: { fontFamily: 'Hind-Siliguri-Bold', fontSize: 17, color: '#fff' },
  resendRow: { marginTop: 20 },
  resendText: { fontFamily: 'Hind-Siliguri-Regular', fontSize: 14, color: colors.textSecondary },
  resendLink: { fontFamily: 'Hind-Siliguri-SemiBold', color: colors.primary },
});

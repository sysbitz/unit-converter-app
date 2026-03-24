import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

const BDAPPS_PHP_BASE = process.env.EXPO_PUBLIC_PHP_BASE_URL!;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  sendOtp: (mobile: string) => Promise<{ referenceNo: string }>;
  verifyOtp: (otp: string, referenceNo: string, mobile: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

export type Profile = {
  id: string;
  mobile: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  }

  async function sendOtp(mobile: string): Promise<{ referenceNo: string }> {
    const formData = new FormData();
    formData.append('user_mobile', mobile);

    const res = await fetch(`${BDAPPS_PHP_BASE}/send_otp.php`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('ওটিপি পাঠানো ব্যর্থ হয়েছে');
    const data = await res.json();
    if (!data.referenceNo) throw new Error('রেফারেন্স নম্বর পাওয়া যায়নি');
    return { referenceNo: data.referenceNo };
  }

  async function verifyOtp(otp: string, referenceNo: string, mobile: string): Promise<void> {
    const formData = new FormData();
    formData.append('Otp', otp);
    formData.append('referenceNo', referenceNo);

    const res = await fetch(`${BDAPPS_PHP_BASE}/verify_otp.php`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('ওটিপি যাচাই ব্যর্থ হয়েছে');
    const data = await res.json();

    if (data.subscriptionStatus !== 'ACTIVE' && data.subscriptionStatus !== 'SUCCESS') {
      throw new Error('ওটিপি সঠিক নয়');
    }

    // Sign in to Supabase with phone OTP (use mobile as identifier)
    // We use email trick: mobile@bdapps.local as a deterministic email
    const fakeEmail = `88${mobile}@bdapps.local`;
    const password = `bdapps_${mobile}_secure`;

    // Try sign in first, if fails sign up
    let { error: signInError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    if (signInError) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
      });
      if (signUpError) throw new Error(signUpError.message);

      if (signUpData.user) {
        await supabase.from('profiles').upsert({
          id: signUpData.user.id,
          mobile,
          name: null,
          avatar_url: null,
        });
      }
    }
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async function updateProfile(data: Partial<Profile>): Promise<void> {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);
    if (error) throw new Error(error.message);
    await fetchProfile(user.id);
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, sendOtp, verifyOtp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

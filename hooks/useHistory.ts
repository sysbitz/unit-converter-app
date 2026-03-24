import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export type HistoryEntry = {
  id: string;
  user_id: string;
  category_id: string;
  category_name: string;
  from_unit: string;
  from_unit_name: string;
  to_unit: string;
  to_unit_name: string;
  input_value: number;
  output_value: number;
  created_at: string;
};

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  async function fetchHistory() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('conversion_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setHistory(data);
    setLoading(false);
  }

  async function saveConversion(entry: Omit<HistoryEntry, 'id' | 'user_id' | 'created_at'>) {
    if (!user) return;
    const { error } = await supabase.from('conversion_history').insert({
      ...entry,
      user_id: user.id,
    });
    if (!error) fetchHistory();
  }

  async function clearHistory() {
    if (!user) return;
    await supabase.from('conversion_history').delete().eq('user_id', user.id);
    setHistory([]);
  }

  return { history, loading, saveConversion, clearHistory, refetch: fetchHistory };
}

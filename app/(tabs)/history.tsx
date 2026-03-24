import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, Platform, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useHistory, HistoryEntry } from '@/hooks/useHistory';
import { toBengaliDigits, formatResult } from '@/constants/units';
import { UNIT_CATEGORIES } from '@/constants/units';

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const { history, loading, clearHistory } = useHistory();
  const styles = makeStyles(colors, isDark);

  function getCategoryColor(catId: string) {
    return UNIT_CATEGORIES.find(c => c.id === catId)?.color ?? colors.primary;
  }

  function getCategoryLabel(catId: string, catName: string) {
    const cat = UNIT_CATEGORIES.find(c => c.id === catId);
    return cat ? `${cat.namebn} (${cat.nameen})` : catName;
  }

  function confirmClear() {
    Alert.alert(
      'ইতিহাস মুছুন',
      'সব রূপান্তর ইতিহাস মুছে ফেলবেন?',
      [
        { text: 'বাতিল', style: 'cancel' },
        { text: 'মুছুন', style: 'destructive', onPress: clearHistory },
      ]
    );
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return toBengaliDigits(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`);
  }

  const renderItem = ({ item }: { item: HistoryEntry }) => {
    const color = getCategoryColor(item.category_id);
    return (
      <View style={styles.card}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={[styles.categoryLabel, { color }]}>{getCategoryLabel(item.category_id, item.category_name)}</Text>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          </View>
          <Text style={styles.conversionText}>
            {toBengaliDigits(formatResult(item.input_value))} {item.from_unit_name}
            {'  →  '}
            {toBengaliDigits(formatResult(item.output_value))} {item.to_unit_name}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>রূপান্তর ইতিহাস</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={confirmClear}>
            <Feather name="trash-2" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
      ) : history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyTitle}>কোনো ইতিহাস নেই</Text>
          <Text style={styles.emptyText}>রূপান্তর করলে এখানে দেখা যাবে</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontFamily: 'Hind-Siliguri-Bold', fontSize: 20, color: colors.text },
  card: {
    backgroundColor: colors.surface, borderRadius: 14,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  categoryDot: { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryLabel: { fontFamily: 'Hind-Siliguri-SemiBold', fontSize: 13 },
  dateText: { fontFamily: 'Hind-Siliguri-Regular', fontSize: 12, color: colors.textTertiary },
  conversionText: { fontFamily: 'Hind-Siliguri-Medium', fontSize: 15, color: colors.text },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontFamily: 'Hind-Siliguri-SemiBold', fontSize: 18, color: colors.text },
  emptyText: { fontFamily: 'Hind-Siliguri-Regular', fontSize: 14, color: colors.textSecondary },
});

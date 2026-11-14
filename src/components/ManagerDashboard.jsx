import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Super Admin Trip Rates (Unalterable by normal users)
  const tripRates = [
    { id: 1, route: 'Horana - Colombo', rate: 'LKR 15,000' },
    { id: 2, route: 'Beruwala - Kerawalapitiya', rate: 'LKR 22,000' },
    { id: 3, route: 'Per KM Rate (Outstation)', rate: 'LKR 120/km' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Super Admin & Manager Panel</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('overview')} style={[styles.tab, activeTab === 'overview' && styles.activeTab]}>
          <Text style={styles.tabText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('rates')} style={[styles.tab, activeTab === 'rates' && styles.activeTab]}>
          <Text style={styles.tabText}>Trip Rates (Admin)</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Cash / Bank</Text>
          <Text style={styles.amountText}>LKR 1,250,000.00</Text>
          <Text style={styles.cardTitle}>Fleet Maintenance Alerts</Text>
          <Text style={styles.alertText}>Ashok Leyland 1618: Oil change due in 500km.</Text>
        </View>
      )}

      {activeTab === 'rates' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Standard Trip Rates (Fixed)</Text>
          {tripRates.map((rate) => (
            <View key={rate.id} style={styles.rateRow}>
              <Text style={styles.rateRoute}>{rate.route}</Text>
              <Text style={styles.rateAmount}>{rate.rate}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' }, // Deep Cobalt Blue
  tabContainer: { flexDirection: 'row', marginBottom: 20 },
  tab: { flex: 1, padding: 12, backgroundColor: '#e5e7eb', alignItems: 'center', borderRadius: 8, marginHorizontal: 4 },
  activeTab: { backgroundColor: '#f59e0b' }, // Bright Orange/Yellow
  tabText: { fontWeight: 'bold', color: '#1f2937' },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#6b7280', marginBottom: 8, marginTop: 12 },
  amountText: { fontSize: 28, fontWeight: 'bold', color: '#10b981' },
  alertText: { fontSize: 14, color: '#ef4444', marginTop: 4 },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rateRoute: { fontSize: 16, color: '#374151' },
  rateAmount: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' }
});

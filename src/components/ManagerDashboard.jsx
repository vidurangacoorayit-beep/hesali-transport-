import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ManagerDashboard() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Operational Manager Dashboard</Text>
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Cash / Bank</Text>
          <Text style={styles.cardValue}>LKR 0.00</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crew Expenditure</Text>
          <Text style={styles.cardValue}>LKR 0.00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fleet Maintenance Alerts</Text>
        <Text style={styles.subText}>No active alerts. All trucks are in good condition.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, width: '48%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subText: { color: '#64748b', fontSize: 14 }
});

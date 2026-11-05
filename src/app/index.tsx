import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AccountantScreen from '../components/AccountantScreen';
import ManagerDashboard from '../components/ManagerDashboard';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('manager');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e293b" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hesali Transport Manager</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'manager' && styles.activeTab]} 
            onPress={() => setActiveTab('manager')}
          >
            <Text style={[styles.tabText, activeTab === 'manager' && styles.activeTabText]}>Manager Panel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'accountant' && styles.activeTab]} 
            onPress={() => setActiveTab('accountant')}
          >
            <Text style={[styles.tabText, activeTab === 'accountant' && styles.activeTabText]}>Accountant Panel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'manager' ? <ManagerDashboard /> : <AccountantScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { backgroundColor: '#1e293b', padding: 15, paddingTop: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#334155', borderRadius: 8, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#2563eb' },
  tabText: { color: '#94a3b8', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#fff' },
  content: { flex: 1 }
});

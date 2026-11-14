import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AccountantScreen() {
  const [odometer, setOdometer] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const handleSaveExpense = () => {
    // Firebase save logic will go here
    setExpenseAmount('');
    setExpenseDesc('');
    alert('Expense Deducted Successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Accountant Panel</Text>

      {/* Daily Odometer Update */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Update Daily Odometer (Ashok Leyland 1618)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current KM"
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
        />
      </View>

      {/* Expense Deductions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bank Expense Deductions (Highway, Salaries, Repairs)</Text>
        <TextInput
          style={styles.input}
          placeholder="Description (e.g. Highway Bill)"
          value={expenseDesc}
          onChangeText={setExpenseDesc}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount (LKR)"
          keyboardType="numeric"
          value={expenseAmount}
          onChangeText={setExpenseAmount}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveExpense}>
          <Text style={styles.buttonText}>Deduct from Bank</Text>
        </TouchableOpacity>
      </View>

      {/* Keells Receivables */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Keells 30-Day Receivables</Text>
        <View style={styles.receivableRow}>
          <Text style={styles.routeText}>Oct 10: Colombo Trip</Text>
          <Text style={styles.pendingText}>Pending (22 Days Left)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#f59e0b', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  receivableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  routeText: { fontSize: 15, color: '#374151' },
  pendingText: { fontSize: 15, color: '#f59e0b', fontWeight: '600' }
});

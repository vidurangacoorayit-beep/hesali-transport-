import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AccountantScreen() {
  const [route, setRoute] = useState('');
  const [odometer, setOdometer] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Accountant Data Entry Panel</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Route Selection</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter route details (e.g. Colombo - Kandy)" 
          value={route}
          onChangeText={setRoute}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Morning Odometer Log</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter starting km" 
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Trip & Odometer Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16, color: '#0f172a' },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

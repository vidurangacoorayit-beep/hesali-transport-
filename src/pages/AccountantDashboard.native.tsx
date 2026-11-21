import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type Props = {
  companyID: string;
  onSignOut: () => void;
};

type Vehicle = {
  RegistrationNumber?: string;
  currentOdometerKm?: number;
  manualOdometerKm?: number;
  vehicleType?: string;
  status?: string;
};

const formatKm = (value?: number) =>
  typeof value === 'number' ? `${value.toLocaleString('en-US')} km` : 'දත්ත නැත';

export default function AccountantDashboard({ companyID, onSignOut }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const vehicleRef = doc(db, 'companies', companyID, 'vehicles', 'LO-5638');

    return onSnapshot(
      vehicleRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setVehicle(null);
          setError('මෙම සමාගමට වාහන දත්ත හමු නොවුණි.');
        } else {
          setVehicle(snapshot.data() as Vehicle);
          setError('');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Vehicle read failed:', err);
        setError('Firebase දත්ත කියවීමට නොහැකි වුණා. අවසර පරීක්ෂා කරන්න.');
        setLoading(false);
      },
    );
  }, [companyID]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Image
              source={require('../../assets/images/hesali-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandTitle}>Hesali Transport</Text>
              <Text style={styles.brandSubtitle}>ACCOUNTANT PANEL</Text>
            </View>
          </View>
          <Text style={styles.welcome}>ගිණුම් පාලන පුවරුව</Text>
        </View>

        <Text style={styles.pageTitle}>ගිණුම් සාරාංශය</Text>
        <Text style={styles.pageSubtitle}>Finance Overview</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>වාහන තොරතුරු</Text>
          {loading && <Text style={styles.normalText}>Firebase දත්ත ලබාගනිමින්...</Text>}
          {!!error && <Text style={styles.error}>{error}</Text>}

          {!loading && !error && vehicle && (
            <>
              <Text style={styles.vehicleName}>
                {vehicle.RegistrationNumber || 'LO-5638'}
              </Text>
              <Text style={styles.normalText}>
                {vehicle.vehicleType || 'වාහන වර්ගය සඳහන් කර නැත'}
              </Text>

              <View style={styles.valueBox}>
                <Text style={styles.label}>වත්මන් Odometer</Text>
                <Text style={styles.odometer}>
                  {formatKm(vehicle.currentOdometerKm)}
                </Text>
              </View>

              <View style={styles.valueBox}>
                <Text style={styles.label}>Manual Odometer</Text>
                <Text style={styles.manualOdometer}>
                  {formatKm(vehicle.manualOdometerKm)}
                </Text>
              </View>

              <Text style={styles.normalText}>
                වාහන තත්ත්වය: {vehicle.status || 'සඳහන් කර නැත'}
              </Text>
            </>
          )}
        </View>

        <Text style={styles.sectionHeading}>මූල්‍ය තොරතුරු</Text>
        {['මුළු බැංකු ශේෂය', 'ලැබිය යුතු මුදල්', 'ගෙවිය යුතු මුදල්'].map((item) => (
          <View key={item} style={styles.infoCard}>
            <Text style={styles.cardTitle}>{item}</Text>
            <Text style={styles.cardValue}>දත්ත සම්බන්ධ කර නැත</Text>
          </View>
        ))}

        <Pressable style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>🚪 ඉවත් වන්න</Text>
        </Pressable>

        <Text style={styles.footer}>Hesali Transport • Accountant Panel</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { padding: 18, paddingBottom: 40 },
  header: { backgroundColor: '#0047AB', padding: 20, borderRadius: 18, marginBottom: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 55, height: 55, backgroundColor: '#FFFFFF', borderRadius: 12 },
  brandTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  brandSubtitle: { color: '#FF8C00', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  welcome: { color: '#FFFFFF', fontSize: 16, marginTop: 18 },
  pageTitle: { color: '#172554', fontSize: 25, fontWeight: 'bold' },
  pageSubtitle: { color: '#64748B', marginTop: 4, marginBottom: 18 },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 22 },
  sectionTitle: { color: '#0047AB', fontSize: 17, fontWeight: 'bold', marginBottom: 14 },
  vehicleName: { color: '#172554', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  normalText: { color: '#64748B', marginTop: 8 },
  valueBox: { backgroundColor: '#EFF6FF', padding: 15, borderRadius: 12, marginTop: 14 },
  label: { color: '#64748B', fontSize: 13 },
  odometer: { color: '#0047AB', fontSize: 27, fontWeight: 'bold', marginTop: 5 },
  manualOdometer: { color: '#EA580C', fontSize: 25, fontWeight: 'bold', marginTop: 5 },
  error: { color: '#DC2626', marginTop: 8 },
  sectionHeading: { color: '#172554', fontSize: 19, fontWeight: 'bold', marginBottom: 12 },
  infoCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 14, marginBottom: 12 },
  cardTitle: { color: '#64748B', fontSize: 13 },
  cardValue: { color: '#172554', fontWeight: 'bold', fontSize: 16, marginTop: 6 },
  signOutButton: { backgroundColor: '#0047AB', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  signOutText: { color: '#FFFFFF', fontWeight: 'bold' },
  footer: { color: '#94A3B8', textAlign: 'center', marginTop: 25, fontSize: 12 },
});

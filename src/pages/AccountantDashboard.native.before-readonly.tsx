import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';

const vehicles = {
  'LO 5638': {
    name: 'LO 5638 (Lorry)',
    odometer: '112400',
  },
  'NB-1234': {
    name: 'NB-1234 (Ashok Leyland 1618)',
    odometer: '45210',
  },
};

export default function AccountantDashboard() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<keyof typeof vehicles>('LO 5638');

  const [odometer, setOdometer] = useState(
    vehicles['LO 5638'].odometer
  );

  const [updatedOdometers, setUpdatedOdometers] = useState({
    'LO 5638': '112400',
    'NB-1234': '45210',
  });
  const [isSavingOdometer, setIsSavingOdometer] = useState(false);

  useEffect(() => {
    return onSnapshot(
      doc(db, 'vehicles', selectedVehicle),
      (snapshot) => {
        const savedOdometer = snapshot.data()?.odometer;
        if (typeof savedOdometer === 'number' && savedOdometer > 0) {
          const value = String(savedOdometer);
          setUpdatedOdometers((previous) => ({
            ...previous,
            [selectedVehicle]: value,
          }));
          setOdometer(value);
        }
      },
      (error) => { console.error('Firestore read failed:', error); Alert.alert('දෝෂයක්', 'Firestore දත්ත කියවීමට නොහැකි වුණා.'); },
    );
  }, [selectedVehicle]);

  const selectVehicle = (vehicle: keyof typeof vehicles) => {
    setSelectedVehicle(vehicle);
    setOdometer(updatedOdometers[vehicle]);
  };

  const updateOdometer = async () => {
    if (!odometer || Number(odometer) <= 0) {
      Alert.alert('දෝෂයක්', 'නිවැරදි Odometer අගයක් ඇතුළත් කරන්න.');
      return;
    }

    setIsSavingOdometer(true);
    try {
      const value = String(Math.floor(Number(odometer)));
      await setDoc(
        doc(db, 'vehicles', selectedVehicle),
        { odometer: Number(value), updatedAt: serverTimestamp() },
        { merge: true },
      );
      setUpdatedOdometers((previous) => ({
        ...previous,
        [selectedVehicle]: value,
      }));
      setOdometer(value);
      Alert.alert('සාර්ථකයි', 'Odometer අගය Firestore එකට සුරැකුවා.');
    } catch (error) { console.error("Odometer save failed:", error);
      Alert.alert('දෝෂයක්', 'Odometer අගය සුරැකීමට නොහැකි වුණා.');
    } finally {
      setIsSavingOdometer(false);
    }
  };

  const formatNumber = (value: string) =>
    Number(value).toLocaleString('en-US');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Image
              source={require('../../assets/images/hesali-logo.png')}
              style={styles.logo}
              resizeMode="cover"
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

        <View style={styles.vehicleCard}>
          <Text style={styles.sectionTitle}>වාහනය තෝරන්න</Text>

          <View style={styles.vehicleButtons}>
            {(Object.keys(vehicles) as Array<keyof typeof vehicles>).map(
              (vehicle) => (
                <Pressable
                  key={vehicle}
                  onPress={() => selectVehicle(vehicle)}
                  style={[
                    styles.vehicleButton,
                    selectedVehicle === vehicle &&
                      styles.vehicleButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.vehicleButtonText,
                      selectedVehicle === vehicle &&
                        styles.vehicleButtonTextActive,
                    ]}
                  >
                    {vehicle}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          <Text style={styles.vehicleName}>
            {vehicles[selectedVehicle].name}
          </Text>

          <Text style={styles.odometerLabel}>වත්මන් Odometer</Text>
          <Text style={styles.odometerValue}>
            {formatNumber(updatedOdometers[selectedVehicle])} km
          </Text>
          <Text style={styles.demoLabel}>
            Demo data – Database එකට තවම සම්බන්ධ කර නැත
          </Text>
        </View>

        <Text style={styles.sectionHeading}>මූල්‍ය තොරතුරු</Text>

        <View style={styles.infoCard}>
          <Text style={styles.cardIcon}>🏦</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>මුළු බැංකු ශේෂය</Text>
            <Text style={styles.cardValue}>දත්ත සම්බන්ධ කර නැත</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardIcon}>🛒</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>කීල්ස් වෙතින් ලැබිය යුතු</Text>
            <Text style={styles.cardValue}>දත්ත සම්බන්ධ කර නැත</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardIcon}>📄</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>මීළඟ ලීසිං වාරිකය</Text>
            <Text style={styles.cardValue}>දත්ත සම්බන්ධ කර නැත</Text>
          </View>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>Odometer යාවත්කාලීන කිරීම</Text>

          <TextInput
            style={styles.input}
            value={odometer}
            onChangeText={setOdometer}
            keyboardType="numeric"
            placeholder="Odometer අගය ඇතුළත් කරන්න"
          />

          <Pressable style={styles.updateButton} onPress={updateOdometer}>
            <Text style={styles.buttonText}>
              {isSavingOdometer ? 'සුරකිමින්…' : 'Update Odometer'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>ඉක්මන් ක්‍රියාකාරකම්</Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              Alert.alert('Trip Management', 'Trip ඇතුළත් කිරීම ඉදිරියේදී සකස් කරමු.')
            }
          >
            <Text style={styles.buttonText}>
              🚚  අලුත් Trip එකක් ඇතුළත් කරන්න
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              Alert.alert('Finance', 'Invoice Management ඉදිරියේදී සකස් කරමු.')
            }
          >
            <Text style={styles.secondaryButtonText}>
              🧾  Invoice Management
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              Alert.alert('Reports', 'P&L Reports ඉදිරියේදී සකස් කරමු.')
            }
          >
            <Text style={styles.secondaryButtonText}>
              📊  P&L Reports
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Hesali Transport • Accountant Panel
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#0047AB',
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 55,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    color: '#FF8C00',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  welcome: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 18,
  },
  pageTitle: {
    color: '#172554',
    fontSize: 25,
    fontWeight: 'bold',
  },
  pageSubtitle: {
    color: '#64748B',
    marginTop: 4,
    marginBottom: 18,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
  },
  sectionTitle: {
    color: '#0047AB',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  vehicleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  vehicleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  vehicleButtonActive: {
    backgroundColor: '#0047AB',
    borderColor: '#0047AB',
  },
  vehicleButtonText: {
    color: '#334155',
    fontWeight: 'bold',
  },
  vehicleButtonTextActive: {
    color: '#FFFFFF',
  },
  vehicleName: {
    color: '#475569',
    marginTop: 16,
  },
  odometerLabel: {
    color: '#64748B',
    marginTop: 14,
  },
  odometerValue: {
    color: '#0047AB',
    fontSize: 29,
    fontWeight: 'bold',
    marginTop: 4,
  },
  demoLabel: {
    color: '#D97706',
    fontSize: 11,
    marginTop: 6,
  },
  sectionHeading: {
    color: '#172554',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#64748B',
    fontSize: 13,
  },
  cardValue: {
    color: '#172554',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 6,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0047AB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#0047AB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 12,
  },
});

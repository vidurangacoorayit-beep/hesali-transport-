import { useEffect, useState } from 'react';
import {
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

type Section =
  | 'dashboard'
  | 'finance'
  | 'receivables'
  | 'payroll'
  | 'reports';

const menuItems: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'ප්‍රධාන පුවරුව', icon: '📊' },
  { id: 'finance', label: 'Bank & Finance', icon: '🏦' },
  { id: 'receivables', label: 'ලැබිය යුතු මුදල්', icon: '💰' },
  { id: 'payroll', label: 'පඩිපත් (Payroll)', icon: '👥' },
  { id: 'reports', label: 'P&L Reports', icon: '📈' },
];

const sectionInfo: Record<
  Exclude<Section, 'dashboard'>,
  { title: string; description: string }
> = {
  finance: {
    title: 'Bank & Finance',
    description:
      'බැංකු ගිණුම්, මුදල් ලැබීම්, වියදම් සහ ගනුදෙනු මෙතැනින් කළමනාකරණය කරමු.',
  },
  receivables: {
    title: 'ලැබිය යුතු මුදල්',
    description:
      'ගනුදෙනුකරුවන්ගෙන් ලැබිය යුතු මුදල් සහ අයකරගැනීම් මෙතැනින් කළමනාකරණය කරමු.',
  },
  payroll: {
    title: 'පඩිපත් (Payroll)',
    description:
      'රියදුරු සහ සහායක වැටුප්, ගමන් ගෙවීම් සහ අත්තිකාරම් මෙතැනින් කළමනාකරණය කරමු.',
  },
  reports: {
    title: 'P&L Reports',
    description:
      'ආදායම්, වියදම් සහ වාහන අනුව ලාභ අලාභ වාර්තා මෙතැනින් සකස් කරමු.',
  },
};

const formatKm = (value?: number) =>
  typeof value === 'number'
    ? `${value.toLocaleString('en-US')} km`
    : 'දත්ත නැත';

export default function AccountantDashboard({
  companyID,
  onSignOut,
}: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] =
    useState<Section>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');

    const vehicleRef = doc(
      db,
      'companies',
      companyID,
      'vehicles',
      'LO-5638',
    );

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
        setError(
          'Firebase දත්ත කියවීමට නොහැකි වුණා. අවසර පරීක්ෂා කරන්න.',
        );
        setLoading(false);
      },
    );
  }, [companyID]);

  const selectSection = (section: Section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>Hesali Transport</Text>
              <Text style={styles.brandSubtitle}>ACCOUNTANT PANEL</Text>
            </View>
          </View>

          <Text style={styles.welcome}>ගිණුම් පාලන පුවරුව</Text>

          <Pressable
            style={styles.menuButton}
            onPress={() => setMenuOpen((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <Text style={styles.menuButtonText}>
              {menuOpen ? '✕  වසන්න' : '☰  Menu'}
            </Text>
          </Pressable>
        </View>

        {menuOpen && (
          <View style={styles.menuCard}>
            <Text style={styles.menuHeading}>පාලන මෙනුව</Text>

            {menuItems.map((item) => {
              const selected = activeSection === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => selectSection(item.id)}
                  style={[
                    styles.menuItem,
                    selected && styles.menuItemSelected,
                  ]}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.menuItemText,
                      selected && styles.menuItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selected && (
                    <Text style={styles.selectedMark}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {activeSection === 'dashboard' ? (
          <>
            <Text style={styles.pageTitle}>ගිණුම් සාරාංශය</Text>
            <Text style={styles.pageSubtitle}>Finance Overview</Text>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>වාහන තොරතුරු</Text>

              {loading && (
                <Text style={styles.normalText}>
                  Firebase දත්ත ලබාගනිමින්...
                </Text>
              )}

              {!!error && (
                <Text style={styles.error}>{error}</Text>
              )}

              {!loading && !error && vehicle && (
                <>
                  <Text style={styles.vehicleName}>
                    {vehicle.RegistrationNumber || 'LO-5638'}
                  </Text>

                  <Text style={styles.normalText}>
                    {vehicle.vehicleType || 'වාහන වර්ගය සඳහන් කර නැත'}
                  </Text>

                  <View style={styles.valueBox}>
                    <Text style={styles.label}>
                      වත්මන් Odometer
                    </Text>
                    <Text style={styles.odometer}>
                      {formatKm(vehicle.currentOdometerKm)}
                    </Text>
                  </View>

                  <View style={styles.valueBox}>
                    <Text style={styles.label}>
                      Manual Odometer
                    </Text>
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

            {[
              'මුළු බැංකු ශේෂය',
              'ලැබිය යුතු මුදල්',
              'ගෙවිය යුතු මුදල්',
            ].map((item) => (
              <View key={item} style={styles.infoCard}>
                <Text style={styles.cardTitle}>{item}</Text>
                <Text style={styles.cardValue}>
                  දත්ත සම්බන්ධ කර නැත
                </Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderIcon}>
              {menuItems.find((item) => item.id === activeSection)?.icon}
            </Text>

            <Text style={styles.placeholderTitle}>
              {sectionInfo[activeSection].title}
            </Text>

            <Text style={styles.placeholderDescription}>
              {sectionInfo[activeSection].description}
            </Text>

            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                මෙම කොටස තවම සකස් කරමින් පවතී.
                නිවැරදි සමාගම් දත්ත සහ අවසර පද්ධතිය
                සම්බන්ධ කළ පසු මෙම පහසුකම සක්‍රිය කරමු.
              </Text>
            </View>

            <Pressable
              style={styles.backButton}
              onPress={() => selectSection('dashboard')}
            >
              <Text style={styles.backButtonText}>
                ← ප්‍රධාන පුවරුවට යන්න
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={styles.signOutButton}
          onPress={onSignOut}
        >
          <Text style={styles.signOutText}>🚪 ඉවත් වන්න</Text>
        </Pressable>

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
  brandText: {
    flex: 1,
  },
  logo: {
    width: 55,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  menuButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  menuButtonText: {
    color: '#0047AB',
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 22,
    elevation: 2,
  },
  menuHeading: {
    color: '#172554',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#F1F5F9',
  },
  menuItemSelected: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#0047AB',
  },
  menuIcon: {
    fontSize: 19,
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  menuItemTextSelected: {
    color: '#0047AB',
    fontWeight: 'bold',
  },
  selectedMark: {
    color: '#0047AB',
    fontWeight: 'bold',
    fontSize: 17,
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
  card: {
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
  vehicleName: {
    color: '#172554',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  normalText: {
    color: '#64748B',
    marginTop: 8,
  },
  valueBox: {
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderRadius: 12,
    marginTop: 14,
  },
  label: {
    color: '#64748B',
    fontSize: 13,
  },
  odometer: {
    color: '#0047AB',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 5,
  },
  manualOdometer: {
    color: '#EA580C',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
  },
  error: {
    color: '#DC2626',
    marginTop: 8,
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
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 16,
    marginBottom: 22,
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 38,
    marginBottom: 12,
  },
  placeholderTitle: {
    color: '#172554',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholderDescription: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 12,
  },
  noticeBox: {
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
  noticeText: {
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#0047AB',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#0047AB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 12,
  },
});

import { useEffect, useState } from 'react';
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
      'බැංකු ගිණුම්, මුදල් ලැබීම්, වියදම් සහ ගනුදෙනු කළමනාකරණය මෙතැනින් සකස් කරමු.',
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

export default function AccountantDashboard({
  companyID,
  onSignOut,
}: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] =
    useState<Section>('dashboard');

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

  const formatKm = (value?: number) =>
    typeof value === 'number'
      ? value.toLocaleString('en-US') + ' km'
      : 'දත්ත නැත';

  const activeTitle =
    activeSection === 'dashboard'
      ? 'ගිණුම් සාරාංශය'
      : sectionInfo[activeSection].title;

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col md:flex-row-reverse">
      <aside className="w-full md:w-64 shrink-0 bg-[#0047AB] text-white flex flex-col shadow-xl">
        <div className="px-6 py-7 border-b border-blue-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white text-[#0047AB] flex items-center justify-center text-3xl font-black mb-3">
              H
            </div>
            <h2 className="font-bold text-xl">Accountant Panel</h2>
            <p className="text-[#FFB15C] text-xs font-semibold tracking-widest mt-1">
              HESALI TRANSPORT
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="px-3 pb-3 text-xs uppercase tracking-widest text-blue-200">
            Main Menu
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const selected = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                    selected
                      ? 'bg-blue-900 text-[#FFB15C] font-bold shadow-inner'
                      : 'text-blue-50 hover:bg-blue-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full text-left px-4 py-3 mt-8 text-red-200 hover:bg-blue-800 rounded-xl transition"
          >
            🚪 ඉවත් වන්න
          </button>
        </nav>

        <div className="p-5 border-t border-blue-800 text-xs text-blue-200">
          Hesali Transport
          <p className="mt-1">Accountant Access</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-5 md:p-9 overflow-y-auto">
        <header className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#0047AB] uppercase tracking-wider">
              Hesali Transport / Accountant
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2">
              {activeTitle}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              ගිණුම් සහ මූල්‍ය කළමනාකරණ පුවරුව
            </p>
          </div>

          <div className="bg-blue-50 text-[#0047AB] px-4 py-2 rounded-xl text-sm font-semibold">
            Accountant
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-7 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-[#0047AB]">
                    🚛 වාහන තොරතුරු
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Firebase වෙතින් සජීවීව ලබාගන්නා දත්ත
                  </p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-full font-semibold">
                  ● Live Data
                </span>
              </div>

              {loading && (
                <p className="text-slate-500 py-6">
                  Firebase දත්ත ලබාගනිමින්...
                </p>
              )}

              {!!error && (
                <p
                  role="alert"
                  className="text-red-600 bg-red-50 p-4 rounded-xl"
                >
                  {error}
                </p>
              )}

              {!loading && !error && vehicle && (
                <>
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {vehicle.RegistrationNumber || 'LO-5638'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {vehicle.vehicleType ||
                          'වාහන වර්ගය සඳහන් කර නැත'}
                      </p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm">
                      {vehicle.status || 'තත්ත්වය සඳහන් කර නැත'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                      <p className="text-sm text-slate-600">
                        වත්මන් Odometer
                      </p>
                      <p className="text-2xl font-bold text-[#0047AB] mt-3">
                        {formatKm(vehicle.currentOdometerKm)}
                      </p>
                    </div>

                    <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                      <p className="text-sm text-slate-600">
                        Manual Odometer
                      </p>
                      <p className="text-2xl font-bold text-orange-600 mt-3">
                        {formatKm(vehicle.manualOdometerKm)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                💰 මූල්‍ය සාරාංශය
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[
                  {
                    title: 'මුළු බැංකු ශේෂය',
                    icon: '🏦',
                    color: 'border-blue-600',
                  },
                  {
                    title: 'ලැබිය යුතු මුදල්',
                    icon: '📥',
                    color: 'border-green-600',
                  },
                  {
                    title: 'ගෙවිය යුතු මුදල්',
                    icon: '📤',
                    color: 'border-orange-500',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 ${item.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm text-slate-500 font-medium">
                        {item.title}
                      </h3>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <p className="text-base font-bold text-slate-700 mt-5">
                      දත්ත සම්බන්ධ කර නැත
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Firebase සම්බන්ධ කිරීම අවශ්‍යයි
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection !== 'dashboard' && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-9">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-5">
              {menuItems.find((item) => item.id === activeSection)?.icon}
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              {sectionInfo[activeSection].title}
            </h2>

            <p className="text-slate-600 mt-3 leading-7">
              {sectionInfo[activeSection].description}
            </p>

            <div className="mt-7 p-5 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="font-bold text-orange-700">
                මෙම කොටස තවම සකස් කරමින් පවතී
              </p>
              <p className="text-sm text-orange-700 mt-2 leading-6">
                නිවැරදි සමාගම් දත්ත සහ අවසර පද්ධතිය සම්බන්ධ කළ පසු
                මෙම පහසුකම් සක්‍රීය කරමු.
              </p>
            </div>
          </section>
        )}

        <footer className="text-xs text-slate-400 mt-9 pb-4">
          Hesali Transport • Accountant Panel
        </footer>
      </main>
    </div>
  );
}

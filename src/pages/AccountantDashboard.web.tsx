import { useEffect, useState, type FormEvent } from 'react';
import { recordDailyManualOdometer } from '../services/odometerService';
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

function getSriLankaDate(): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function formatAccountantSummaryForChat(vehicle: Vehicle): string {
  const dateTime = new Intl.DateTimeFormat('si-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Colombo',
  }).format(new Date());

  const formatReading = (value?: number) =>
    typeof value === 'number'
      ? `${value.toLocaleString('en-US')} km`
      : 'දත්ත නැත';

  return [
    'HESALI TRANSPORT - ACCOUNTANT SUMMARY',
    `දිනය සහ වේලාව: ${dateTime} (Sri Lanka)`,
    '',
    `වාහන අංකය: ${vehicle.RegistrationNumber || 'සඳහන් කර නැත'}`,
    `වාහන වර්ගය: ${vehicle.vehicleType || 'සඳහන් කර නැත'}`,
    `වාහන තත්ත්වය: ${vehicle.status || 'සඳහන් කර නැත'}`,
    '',
    `වත්මන් Odometer: ${formatReading(vehicle.currentOdometerKm)}`,
    `Manual Odometer: ${formatReading(vehicle.manualOdometerKm)}`,
  ].join('\n');
}

function openWhatsAppWithSummary(vehicle: Vehicle): void {
  const summary = formatAccountantSummaryForChat(vehicle);
  const url = `https://wa.me/?text=${encodeURIComponent(summary)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function AccountantDashboard({
  companyID,
  onSignOut,
}: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] =
    useState<Section>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [odometerReading, setOdometerReading] = useState('');
  const [odometerDate, setOdometerDate] = useState(getSriLankaDate());
  const [odometerReason, setOdometerReason] = useState('');
  const [odometerSaving, setOdometerSaving] = useState(false);
  const [odometerSuccess, setOdometerSuccess] = useState('');
  const [odometerError, setOdometerError] = useState('');
  const sriLankaDate = getSriLankaDate();

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

  const handleOdometerSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setOdometerSuccess('');
    setOdometerError('');

    if (!odometerReading.trim()) {
      setOdometerError('Odometer reading එක ඇතුළත් කරන්න.');
      return;
    }

    const readingKm = Number(odometerReading);

    if (!Number.isSafeInteger(readingKm) || readingKm < 0) {
      setOdometerError('නිවැරදි සම්පූර්ණ km අගයක් ඇතුළත් කරන්න.');
      return;
    }

    if (!odometerDate) {
      setOdometerError('Reading date එක තෝරන්න.');
      return;
    }

    if (odometerDate !== getSriLankaDate()) {
      setOdometerError('ශ්‍රී ලංකාවේ අද දිනයේ Reading එක පමණක් ඇතුළත් කළ හැකියි.');
      return;
    }

    if (!vehicle) {
      setOdometerError('වාහනයේ දත්ත තවම ලබාගෙන නැහැ. කරුණාකර නැවත උත්සාහ කරන්න.');
      return;
    }

    setOdometerSaving(true);

    try {
      const result = await recordDailyManualOdometer({
        vehicleId: 'LO-5638',
        readingKm,
        readingDate: odometerDate,
        reason: odometerReason.trim(),
      });

      setOdometerSuccess(
        `${result.message} Previous: ${result.previousReadingKm.toLocaleString('en-US')} km.`,
      );
      setOdometerReading('');
      setOdometerReason('');
    } catch (err: unknown) {
      setOdometerError(
        err instanceof Error
          ? err.message
          : 'Odometer update කිරීම අසාර්ථක වුණා.',
      );
    } finally {
      setOdometerSaving(false);
    }
  };

  const activeTitle =
    activeSection === 'dashboard'
      ? 'ගිණුම් සාරාංශය'
      : sectionInfo[activeSection].title;

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col md:flex-row-reverse">
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm">
        <span className="font-bold text-[#0047AB]">Hesali Transport</span>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="px-4 py-2 rounded-lg bg-[#0047AB] text-white font-semibold"
        >
          {mobileMenuOpen ? '✕ වසන්න' : '☰ Menu'}
        </button>
      </div>
      <aside className={`w-full md:w-64 shrink-0 bg-[#0047AB] text-white flex-col shadow-xl ${mobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
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
                  onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
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
            onClick={() => { setMobileMenuOpen(false); onSignOut(); }}
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

                  <button
                    type="button"
                    onClick={() => openWhatsAppWithSummary(vehicle)}
                    className="mt-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-5 py-3"
                  >
                    WhatsApp හරහා Summary Share කරන්න
                  </button>

                  <div className="mt-7 border border-slate-200 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-[#0047AB]">
                      📝 Daily Manual Odometer Update
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      පෙර Manual Reading: {formatKm(vehicle.manualOdometerKm)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      සාමාන්‍ය entry එකකදී පෙර reading එකට වඩා අඩු අගයක් ඇතුළත් කළ නොහැක.
                    </p>

                    <form onSubmit={handleOdometerSubmit} className="mt-5 space-y-4">
                      <div>
                        <label htmlFor="odometer-reading" className="block text-sm font-semibold text-slate-700 mb-2">
                          අලුත් Odometer Reading (km)
                        </label>
                        <input
                          id="odometer-reading"
                          type="number"
                          min="0"
                          step="1"
                          required
                          value={odometerReading}
                          onChange={(event) => setOdometerReading(event.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-4 py-3"
                          placeholder="උදා: 109438"
                        />
                      </div>

                      <div>
                        <label htmlFor="odometer-date" className="block text-sm font-semibold text-slate-700 mb-2">
                          Reading Date
                        </label>
                        <input
                          id="odometer-date"
                          type="date"
                          required
                          min={sriLankaDate}
                          max={sriLankaDate}
                          value={odometerDate}
                          onChange={(event) => setOdometerDate(event.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-4 py-3"
                        />
                      </div>

                      <div>
                        <label htmlFor="odometer-reason" className="block text-sm font-semibold text-slate-700 mb-2">
                          Reason (Optional)
                        </label>
                        <textarea
                          id="odometer-reason"
                          maxLength={500}
                          value={odometerReason}
                          onChange={(event) => setOdometerReason(event.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-4 py-3"
                          rows={3}
                          placeholder="අමතර සටහනක්..."
                        />
                      </div>

                      {!!odometerError && (
                        <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                          {odometerError}
                        </p>
                      )}

                      {!!odometerSuccess && (
                        <p role="status" className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                          {odometerSuccess}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={odometerSaving}
                        className="w-full bg-[#0047AB] text-white font-semibold rounded-lg px-5 py-3 disabled:opacity-50"
                      >
                        {odometerSaving ? 'Saving...' : 'Save Manual Odometer'}
                      </button>
                    </form>
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

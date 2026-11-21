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

const logo = require('../../assets/images/hesali-logo.png');

export default function AccountantDashboard({ companyID, onSignOut }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('Firebase දත්ත කියවීමට නොහැකි වුණා. අවසර පරීක්ෂා කරන්න.');
        setLoading(false);
      },
    );
  }, [companyID]);

  const formatKm = (value?: number) =>
    typeof value === 'number' ? value.toLocaleString('en-US') + ' km' : 'දත්ත නැත';

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex flex-col md:flex-row-reverse">
      <aside className="w-full md:w-64 bg-[#0047AB] text-white flex flex-col shadow-2xl">
        <div className="p-6 flex flex-col items-center border-b border-blue-800">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden mb-3">
            <img src={logo} alt="Hesali Transport" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-bold text-lg">Accountant Panel</h2>
          <p className="text-[#FF8C00] text-xs font-semibold">HESALI TRANSPORT</p>
        </div>
        <nav className="flex-1 p-4">
          <div className="bg-blue-900 text-[#FF8C00] px-4 py-3 rounded-xl font-bold">
            📊 ප්‍රධාන පුවරුව
          </div>
          <button onClick={onSignOut} className="w-full text-left px-4 py-3 mt-6 text-red-200 hover:bg-blue-800 rounded-xl">
            🚪 ඉවත් වන්න
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">ගිණුම් සාරාංශය</h1>
          <p className="text-sm text-slate-500 mt-1">Finance Overview</p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-[#0047AB] mb-4">වාහන තොරතුරු</h2>

          {loading && <p className="text-slate-500">Firebase දත්ත ලබාගනිමින්...</p>}
          {!!error && <p role="alert" className="text-red-600">{error}</p>}

          {!loading && !error && vehicle && (
            <>
              <p className="text-xl font-bold text-slate-800">
                {vehicle.RegistrationNumber || 'LO-5638'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {vehicle.vehicleType || 'වාහන වර්ගය සඳහන් කර නැත'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div className="bg-blue-50 p-5 rounded-xl">
                  <p className="text-sm text-slate-600">වත්මන් Odometer</p>
                  <p className="text-2xl font-bold text-[#0047AB] mt-2">
                    {formatKm(vehicle.currentOdometerKm)}
                  </p>
                </div>
                <div className="bg-orange-50 p-5 rounded-xl">
                  <p className="text-sm text-slate-600">Manual Odometer</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    {formatKm(vehicle.manualOdometerKm)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                වාහන තත්ත්වය: {vehicle.status || 'සඳහන් කර නැත'}
              </p>
            </>
          )}
        </section>

        <h2 className="text-lg font-bold text-slate-800 mb-4">මූල්‍ය තොරතුරු</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['මුළු බැංකු ශේෂය', 'ලැබිය යුතු මුදල්', 'ගෙවිය යුතු මුදල්'].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-[#0047AB]">
              <h3 className="text-slate-500 text-sm">{item}</h3>
              <p className="text-lg font-bold text-slate-700 mt-3">දත්ත සම්බන්ධ කර නැත</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-8">
          Hesali Transport • Accountant Panel
        </p>
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';
const logo = require('../../assets/images/hesali-logo.png');

const AccountantDashboard = () => {
  type VehicleId = 'LO 5638' | 'NB-1234';
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleId>('LO 5638');
  const [odometer, setOdometer] = useState('112400');
  const [savedOdometers, setSavedOdometers] = useState<Record<VehicleId, string>>({
    'LO 5638': '112400',
    'NB-1234': '45210',
  });
  const [isSavingOdometer, setIsSavingOdometer] = useState(false);
  const [odometerError, setOdometerError] = useState('');

  const vehicleData = {
    'LO 5638': { name: 'LO 5638 (Lorry)' },
    'NB-1234': { name: 'NB-1234 (Ashok Leyland 1618)' },
  };

  useEffect(() => {
    return onSnapshot(
      doc(db, 'vehicles', selectedVehicle),
      (snapshot) => {
        const value = snapshot.data()?.odometer;
        if (typeof value === 'number' && value > 0) {
          const formattedValue = String(value);
          setSavedOdometers((previous) => ({
            ...previous,
            [selectedVehicle]: formattedValue,
          }));
          setOdometer(formattedValue);
        }
        setOdometerError('');
      },
      () => setOdometerError('Firestore දත්ත කියවීමට නොහැකි වුණා.'),
    );
  }, [selectedVehicle]);

  useEffect(() => {
    setOdometer(savedOdometers[selectedVehicle]);
  }, [selectedVehicle, savedOdometers]);

  const updateOdometer = async () => {
    const value = Number(odometer);
    if (!Number.isInteger(value) || value <= 0) {
      setOdometerError('නිවැරදි Odometer අගයක් ඇතුළත් කරන්න.');
      return;
    }

    setIsSavingOdometer(true);
    setOdometerError('');
    try {
      await setDoc(
        doc(db, 'vehicles', selectedVehicle),
        { odometer: value, updatedAt: serverTimestamp() },
        { merge: true },
      );
      setSavedOdometers((previous) => ({
        ...previous,
        [selectedVehicle]: String(value),
      }));
      setOdometer(String(value));
    } catch {
      setOdometerError('Odometer අගය සුරැකීමට නොහැකි වුණා.');
    } finally {
      setIsSavingOdometer(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex flex-col md:flex-row-reverse">

      {/* Right-Side Sidebar */}
      <aside className="w-full md:w-64 bg-[#0047AB] text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 flex flex-col items-center border-b border-blue-800">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#FF8C00] overflow-hidden mb-3">
             <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-bold text-lg text-center">Accountant Panel</h2>
          <p className="text-[#FF8C00] text-xs font-semibold uppercase tracking-wider">Hesali Transport</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full text-left bg-blue-900 text-[#FF8C00] px-4 py-3 rounded-xl font-bold shadow-inner">📊 ප්‍රධාන පුවරුව</button>
          <button className="w-full text-left hover:bg-blue-800 px-4 py-3 rounded-xl transition font-medium">🏦 Bank & Finance</button>
          <button className="w-full text-left hover:bg-blue-800 px-4 py-3 rounded-xl transition font-medium">🛒 Keels Receivables</button>
          <button className="w-full text-left hover:bg-blue-800 px-4 py-3 rounded-xl transition font-medium">💵 Payroll (පඩිපත්)</button>
          <button className="w-full text-left hover:bg-blue-800 px-4 py-3 rounded-xl transition font-medium">📄 P&L Reports</button>
          <button className="w-full text-left hover:bg-blue-800 px-4 py-3 rounded-xl transition font-medium mt-8 text-red-300">🚪 ඉවත් වන්න</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* Header Title & Vehicle Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">ගිණුම් සාරාංශය (Finance Overview)</h1>
                <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-bold text-sm">වාහනය තෝරන්න:</span>
                    {/* Vehicle Dropdown */}
                    <select
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value as VehicleId)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none px-3 py-2 cursor-pointer font-bold"
                    >
                        <option value="LO 5638">LO 5638</option>
                        <option value="NB-1234">NB-1234 (Ashok Leyland 1618)</option>
                    </select>
                </div>
            </div>

            <div className="text-left md:text-right w-full md:w-auto bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-500">වත්මන් Odometer ({selectedVehicle})</p>
                <p className="text-2xl font-bold text-[#0047AB]">{Number(savedOdometers[selectedVehicle]).toLocaleString('en-US')} km</p>
            </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-[#0047AB]">
                <h3 className="text-slate-500 font-medium text-sm mb-1">මුළු බැංකු ශේෂය</h3>
                <p className="text-3xl font-bold text-slate-800">LKR 450,000</p>
                <p className="text-xs text-green-600 mt-2 font-medium">↑ පසුගිය සතියට වඩා 12% කින් වැඩි වී ඇත</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-[#FF8C00]">
                <h3 className="text-slate-500 font-medium text-sm mb-1">කීල්ස් වෙතින් ලැබිය යුතු</h3>
                <p className="text-3xl font-bold text-[#FF8C00]">LKR 125,500</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">⏳ ඉන්වොයිස් 3 ක් පමා වී ඇත</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-500">
                <h3 className="text-slate-500 font-medium text-sm mb-1">මීළඟ ලීසිං වාරිකය</h3>
                <p className="text-3xl font-bold text-slate-800">LKR 85,000</p>
                <p className="text-xs text-red-500 mt-2 font-medium">🗓️ ගෙවිය යුතු දිනය: 2026-11-15 (දින 7ක් ඉතිරියි)</p>
            </div>
        </div>

        {/* Action & Data Entry Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Odometer & Trip Entry */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-[#0047AB] mb-4 border-b pb-2 flex justify-between items-center">
                   දෛනික ගමන් සහ මීටර්
                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{selectedVehicle}</span>
                </h3>

                {/* Odometer Input */}
                <div className="mb-5">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Odometer අගය යාවත්කාලීන කරන්න</label>
                    <div className="flex gap-2">
                        <input type="number" min="1" step="1" value={odometer} onChange={(e) => setOdometer(e.target.value)} placeholder="උදා: 45300" className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF8C00] outline-none bg-slate-50" />
                        <button onClick={updateOdometer} disabled={isSavingOdometer} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-60">{isSavingOdometer ? 'සුරකිමින්…' : 'Update'}</button>
                    </div>
                    {odometerError && <p role="alert" className="text-sm text-red-600 mt-2">{odometerError}</p>}
                </div>

                {/* Add Trip Button */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">අලුත් ගමනක් (Trip) ඇතුළත් කරන්න</label>
                    <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl shadow hover:bg-slate-700 transition flex items-center justify-center">
                        <span className="mr-2">🚚</span> {selectedVehicle} සඳහා ට්‍රිප් විස්තර ඇතුළත් කරන්න
                    </button>
                </div>
            </div>

            {/* Quick Actions (Finance) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">ඉක්මන් මුල්‍ය ක්‍රියාකාරකම්</h3>

                <button className="w-full bg-[#0047AB] text-white font-bold py-4 rounded-xl shadow hover:bg-blue-900 transition flex items-center justify-center">
                    <span className="mr-2">🧾</span> අලුත් ඉන්වොයිසියක් (Keels) ඇතුලත් කරන්න
                </button>

                <button className="w-full bg-slate-100 text-[#0047AB] border border-[#0047AB] font-bold py-4 rounded-xl shadow-sm hover:bg-slate-200 transition flex items-center justify-center">
                    <span className="mr-2">⬇️</span> P&L වාර්තාව (Excel) බාගත කරන්න
                </button>
            </div>

        </div>

      </main>
    </div>
  );
};

export default AccountantDashboard;

import { useEffect } from 'react';
// ලෝගෝ එක import කරන විදිහ (ෆයිල් එකේ නම වෙනස් නම් මෙතනත් වෙනස් කරන්න)
import logo from '../assets/logo.png';

const Login = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-slate-100 font-sans min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">

        {/* Header Section with Logo */}
        <div className="bg-[#0047AB] p-10 text-center rounded-b-[40px] shadow-lg relative z-10">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#FF8C00] mb-4 overflow-hidden">
            {/* මෙන්න මේ කෑල්ල තමයි වෙනස් වුණේ */}
            <img src={logo} alt="Hesali Transport Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">හෙසාලි ට්‍රාන්ස්පෝර්ට්</h1>
          <p className="text-[#FF8C00] mt-2 text-sm font-semibold tracking-wider uppercase">Fleet Management</p>
        </div>

        {/* Login Form */}
        <div className="p-8 pt-10">
          <form className="space-y-6">

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">පරිශීලක නාමය (Username)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">👤</span>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition bg-slate-50"
                  placeholder="උදා: admin / driver / helper"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">මුරපදය (Password)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔒</span>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition bg-slate-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ගිණුම් වර්ගය (Role)</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0047AB] outline-none bg-slate-50 font-medium text-slate-700 cursor-pointer">
                <option value="admin">Super Admin</option>
                <option value="manager">Manager</option>
                <option value="accountant">Accountant</option>
                <option value="driver">Driver</option>
                <option value="helper">Helper</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full bg-[#0047AB] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-900 active:scale-95 transition flex justify-center items-center group mt-4"
            >
              ඇතුල් වන්න
              <span className="ml-2 group-hover:translate-x-1 transition-transform">➔</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

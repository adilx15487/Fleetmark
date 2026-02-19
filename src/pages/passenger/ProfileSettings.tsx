import { useState } from 'react';
import { Camera, Save, Trash2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { passengerProfile } from '../../data/passengerMockData';

const ProfileSettings = () => {
  const [form, setForm] = useState({
    name: passengerProfile.name,
    email: passengerProfile.email,
    phone: passengerProfile.phone,
    organizationType: passengerProfile.organizationType,
    organizationName: passengerProfile.organizationName,
    defaultRoute: passengerProfile.defaultRoute,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Save profile:', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Change password');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={passengerProfile.avatar}
              alt={passengerProfile.name}
              className="w-20 h-20 rounded-full bg-slate-200"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center border-2 border-white shadow-lg hover:bg-primary-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-900">{passengerProfile.name}</h2>
            <p className="text-sm text-slate-400">{passengerProfile.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
              Passenger
            </span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h3 className="text-sm font-bold text-primary-900">Personal Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              disabled
              className={`${inputClass} bg-slate-50 text-slate-400 cursor-not-allowed`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+212 6 00 00 00 00"
            className={inputClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Organization Type</label>
            <div className="relative">
              <select
                value={form.organizationType}
                onChange={(e) => setForm({ ...form, organizationType: e.target.value as typeof form.organizationType })}
                className={`${inputClass} appearance-none cursor-pointer bg-white`}
              >
                <option value="University">University</option>
                <option value="Enterprise">Enterprise</option>
                <option value="School">School</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Organization Name</label>
            <input
              type="text"
              value={form.organizationName}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Default Route</label>
          <div className="relative">
            <select
              value={form.defaultRoute}
              onChange={(e) => setForm({ ...form, defaultRoute: e.target.value })}
              className={`${inputClass} appearance-none cursor-pointer bg-white`}
            >
              <option>Route A — Campus Express</option>
              <option>Route B — Downtown Loop</option>
              <option>Route C — Industrial Zone</option>
              <option>Route D — Airport Shuttle</option>
              <option>Route E — Medical Campus</option>
              <option>Route F — School Morning</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h3 className="text-sm font-bold text-primary-900">Change Password</h3>

        {(['current', 'newPass', 'confirm'] as const).map((field) => {
          const labels = {
            current: 'Current Password',
            newPass: 'New Password',
            confirm: 'Confirm New Password',
          };
          return (
            <div key={field}>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">{labels[field]}</label>
              <div className="relative">
                <input
                  type={showPasswords[field] ? 'text' : 'password'}
                  value={passwords[field]}
                  onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">
          Once you delete your account, all of your data — including reservations, ride history, and profile — will be permanently removed. This action cannot be undone.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]">
          <Trash2 className="w-4 h-4" />
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;

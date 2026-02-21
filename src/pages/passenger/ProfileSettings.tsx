import { useState } from 'react';
import { Camera, Save, Trash2, Eye, EyeOff, ChevronDown, Bus, MapPin, Ticket, ArrowRight, X } from 'lucide-react';
import { passengerProfile } from '../../data/passengerMockData';
import { useToast } from '../../context/ToastContext';
import { useReservation, ALL_STOPS, getBusForStop, isSharedStop, type BusAssignment } from '../../context/ReservationContext';

const ProfileSettings = () => {
  const { toast } = useToast();
  const {
    isOnboarded,
    transport,
    reservationsUsed,
    maxReservations,
    getBusInfo,
    changeHomeStop,
  } = useReservation();

  const busInfo = getBusInfo();

  const [form, setForm] = useState({
    name: passengerProfile.name,
    email: passengerProfile.email,
    phone: passengerProfile.phone,
    organizationType: passengerProfile.organizationType,
    organizationName: passengerProfile.organizationName,
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

  /* ── Change Home Stop modal ── */
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopSearch, setStopSearch] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [selectedBus, setSelectedBus] = useState<BusAssignment | null>(null);
  const [changeStep, setChangeStep] = useState<'select' | 'confirm'>('select');

  const filteredStops = ALL_STOPS.filter((s) =>
    s.toLowerCase().includes(stopSearch.toLowerCase()),
  );

  const openChangeModal = () => {
    setStopSearch('');
    setSelectedStop('');
    setSelectedBus(null);
    setChangeStep('select');
    setShowStopModal(true);
  };

  const handleStopSelect = (stop: string) => {
    setSelectedStop(stop);
    if (isSharedStop(stop)) {
      setSelectedBus(null);
    } else {
      const buses = getBusForStop(stop);
      if (buses.length > 0) setSelectedBus(buses[0]);
    }
  };

  const confirmStopChange = () => {
    if (!selectedStop || !selectedBus) return;
    changeHomeStop(selectedStop, selectedBus);
    setShowStopModal(false);
    toast('Home stop updated! Your bus has been reassigned.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Profile updated successfully!');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Password updated successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300';

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

      {/* Transport Settings */}
      {isOnboarded && transport && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary-900">Transport Settings</h3>
            <span className="text-xs text-slate-400">1337 Night Shuttle</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Home Stop */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-medium text-slate-500">Home Stop</span>
              </div>
              <p className="text-sm font-bold text-primary-900">{transport.homeStop}</p>
              <button
                onClick={openChangeModal}
                className="mt-2 text-xs font-semibold text-accent-500 hover:text-accent-600 transition-colors"
              >
                Change →
              </button>
            </div>

            {/* Assigned Bus */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-medium text-slate-500">Assigned Bus</span>
              </div>
              <p className="text-sm font-bold text-primary-900">{busInfo?.busNumber || '—'}</p>
              <p className="text-xs text-slate-400 mt-1">{busInfo?.routeName || ''}</p>
            </div>

            {/* Tonight's Usage */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-slate-500">Tonight</span>
              </div>
              <p className="text-sm font-bold text-primary-900">
                {reservationsUsed} / {maxReservations} trips
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    reservationsUsed >= maxReservations
                      ? 'bg-red-500'
                      : reservationsUsed >= maxReservations - 1
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(reservationsUsed / maxReservations) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
                onChange={(e) =>
                  setForm({
                    ...form,
                    organizationType: e.target.value as typeof form.organizationType,
                  })
                }
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
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords[field] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
          Once you delete your account, all of your data — including reservations, ride history, and
          profile — will be permanently removed. This action cannot be undone.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]">
          <Trash2 className="w-4 h-4" />
          Delete My Account
        </button>
      </div>

      {/* ── Change Home Stop Modal ── */}
      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-primary-900">Change Home Stop</h3>
              <button
                onClick={() => setShowStopModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {changeStep === 'select' ? (
                <>
                  <p className="text-xs text-slate-500">
                    Changing your stop may reassign your bus. Your active reservations for tonight will
                    remain valid.
                  </p>
                  <input
                    type="text"
                    placeholder="Search stops..."
                    value={stopSearch}
                    onChange={(e) => setStopSearch(e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredStops.map((stop) => (
                      <button
                        key={stop}
                        onClick={() => handleStopSelect(stop)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedStop === stop
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{stop}</span>
                          {isSharedStop(stop) && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                              Both routes
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Shared stop bus picker */}
                  {selectedStop && isSharedStop(selectedStop) && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500">
                        This stop is served by both buses. Pick one:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {getBusForStop(selectedStop).map((bus) => (
                          <button
                            key={bus}
                            onClick={() => setSelectedBus(bus)}
                            className={`p-3 rounded-xl border text-center text-sm font-semibold transition-all ${
                              selectedBus === bus
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            {bus}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedStop && selectedBus && (
                    <button
                      onClick={() => setChangeStep('confirm')}
                      className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 inline ml-1" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800 font-semibold mb-1">⚠️ Confirm Change</p>
                    <p className="text-xs text-amber-600">
                      Your home stop will change from{' '}
                      <strong>{transport?.homeStop}</strong> to{' '}
                      <strong>{selectedStop}</strong>. Your bus assignment may also change.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      <span className="text-slate-500">New Stop:</span>
                      <span className="font-bold text-primary-900">{selectedStop}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bus className="w-4 h-4 text-sky-500" />
                      <span className="text-slate-500">New Bus:</span>
                      <span className="font-bold text-primary-900">{selectedBus}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setChangeStep('select')}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirmStopChange}
                      className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Confirm Change
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;

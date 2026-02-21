import { useState, useMemo } from 'react';
import { Search, Bus, MapPin, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import {
  ALL_STOPS,
  getBusForStop,
  isSharedStop,
  BUS_INFO,
  type BusAssignment,
} from '../../context/ReservationContext';

interface Props {
  onComplete: (stop: string, bus: BusAssignment) => void;
}

const StudentOnboarding = ({ onComplete }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [search, setSearch] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [selectedBus, setSelectedBus] = useState<BusAssignment | null>(null);
  const [showSharedChoice, setShowSharedChoice] = useState(false);

  const filteredStops = useMemo(() => {
    if (!search) return ALL_STOPS;
    const q = search.toLowerCase();
    return ALL_STOPS.filter((s) => s.toLowerCase().includes(q));
  }, [search]);

  const handleSelectStop = (stop: string) => {
    setSelectedStop(stop);
    const buses = getBusForStop(stop);
    if (buses.length === 1) {
      setSelectedBus(buses[0]);
      setShowSharedChoice(false);
      setStep(2);
    } else if (buses.length === 2) {
      // Shared stop — let user pick direction
      setShowSharedChoice(true);
      setSelectedBus(null);
    }
  };

  const handlePickBusForShared = (bus: BusAssignment) => {
    setSelectedBus(bus);
    setShowSharedChoice(false);
    setStep(2);
  };

  const handleConfirm = () => {
    if (selectedStop && selectedBus) {
      onComplete(selectedStop, selectedBus);
    }
  };

  const busInfo = selectedBus ? BUS_INFO[selectedBus] : null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-400 text-primary-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-400/30">
            <Bus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome to Fleetmark! 🚌</h1>
          <p className="text-primary-300 mt-2 text-sm sm:text-base">
            Before your first reservation, tell us where you live.
          </p>
          <p className="text-primary-400 text-xs mt-1">
            We'll assign you to the right bus automatically every time.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= 1 ? 'bg-accent-400 text-primary-900' : 'bg-white/10 text-white/50'
          }`}>
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`w-12 h-0.5 ${step > 1 ? 'bg-accent-400' : 'bg-white/10'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step === 2 ? 'bg-accent-400 text-primary-900' : 'bg-white/10 text-white/50'
          }`}>
            2
          </div>
        </div>

        {/* Step 1 — Select Home Stop */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-primary-900 mb-1">Your drop-off point</h3>
            <p className="text-xs text-slate-400 mb-4">This is where the bus will drop you off every night.</p>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stops…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Stop list */}
            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
              {filteredStops.map((stop) => {
                const isSelected = selectedStop === stop;
                const shared = isSharedStop(stop);
                return (
                  <button
                    key={stop}
                    onClick={() => handleSelectStop(stop)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'bg-primary-50 border-l-4 border-l-primary-500'
                        : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary-600' : 'text-slate-300'}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>
                        {stop}
                      </span>
                      {shared && (
                        <span className="ml-2 text-[10px] text-amber-500 font-semibold">Both routes</span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
                  </button>
                );
              })}
              {filteredStops.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-300">No stops matching "{search}"</div>
              )}
            </div>

            {/* Shared stop choice */}
            {showSharedChoice && selectedStop && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    <strong>{selectedStop}</strong> is served by both buses. Please select your direction:
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['Bus 1', 'Bus 2'] as BusAssignment[]).map((bus) => {
                    const info = BUS_INFO[bus];
                    return (
                      <button
                        key={bus}
                        onClick={() => handlePickBusForShared(bus)}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-primary-300 hover:shadow-sm transition-all text-left"
                      >
                        <p className="text-sm font-bold text-primary-900">{info.busNumber}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{info.routeName}</p>
                        <p className="text-[10px] text-slate-400 mt-1 truncate">
                          {info.stops[0]} → {info.stops[info.stops.length - 1]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Confirm Bus Assignment */}
        {step === 2 && busInfo && (
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-primary-600 mb-4 transition-colors"
            >
              ← Change stop
            </button>

            <h3 className="text-sm font-bold text-primary-900 mb-1">Based on your stop, you'll be on:</h3>

            {/* Bus assignment card */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/20">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary-900">{busInfo.busName}</p>
                  <p className="text-xs text-primary-500">{busInfo.routeName}</p>
                </div>
              </div>

              {/* Route timeline — simplified */}
              <div className="mt-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Route stops</p>
                <div className="flex overflow-x-auto gap-0 pb-2" style={{ scrollbarWidth: 'thin' }}>
                  <div className="flex items-start gap-0 min-w-max">
                    {busInfo.stops.map((stop, i) => {
                      const isHome = stop === selectedStop;
                      return (
                        <div key={i} className="flex items-start">
                          <div className="flex flex-col items-center" style={{ width: '66px' }}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${
                              isHome ? 'bg-emerald-500 ring-2 ring-emerald-300 ring-offset-1' : i === 0 ? 'bg-primary-500' : 'bg-primary-300'
                            }`}>
                              {isHome ? <Check className="w-3 h-3" /> : i + 1}
                            </div>
                            <p className={`text-[9px] text-center mt-1 leading-tight px-0.5 max-w-[62px] ${
                              isHome ? 'font-bold text-emerald-700' : 'text-slate-500'
                            }`}>
                              {stop}
                            </p>
                          </div>
                          {i < busInfo.stops.length - 1 && (
                            <div className="flex items-center mt-[9px]">
                              <div className="w-4 h-[2px] bg-primary-200" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Your stop highlighted */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs text-emerald-400">Your Stop</p>
                <p className="text-sm font-bold text-emerald-800">{selectedStop}</p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-5 px-5 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Confirm & Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOnboarding;

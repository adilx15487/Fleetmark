import { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Users, ArrowRight, Check, CalendarDays, Ticket, ChevronLeft, Bus as BusIcon } from 'lucide-react';
import { availableRoutes, generateSeatMap, type Seat } from '../../data/passengerMockData';

type Step = 1 | 2 | 3;

const stepLabels = ['Choose Route', 'Choose Seat', 'Confirm'];

const ReserveASeat = () => {
  const [step, setStep] = useState<Step>(1);
  const [search, setSearch] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [seats] = useState<Seat[]>(() => generateSeatMap());
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const selectedRoute = availableRoutes.find((r) => r.id === selectedRouteId);

  const filteredRoutes = useMemo(() => {
    if (!search) return availableRoutes.filter((r) => r.status === 'Active');
    return availableRoutes.filter(
      (r) => r.status === 'Active' && r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id);
    const route = availableRoutes.find((r) => r.id === id);
    if (route) setSelectedTime(route.departureTimes[0]);
    setStep(2);
  };

  const handleSelectSeat = (id: string) => {
    const seat = seats.find((s) => s.id === id);
    if (seat && seat.status === 'available') {
      setSelectedSeat(id);
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedRouteId(null);
    setSelectedSeat(null);
    setSelectedTime('');
    setSelectedDate('');
    setConfirmed(false);
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {stepLabels.map((label, i) => {
            const stepNum = (i + 1) as Step;
            const isActive = step === stepNum;
            const isDone = step > stepNum || confirmed;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${isActive ? 'text-primary-900' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-px mx-2 ${step > stepNum ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1 — Choose Route */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search routes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRoutes.map((route) => (
              <button
                key={route.id}
                onClick={() => handleSelectRoute(route.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-lg hover:shadow-primary-100/30 hover:border-primary-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-bold text-primary-900 group-hover:text-primary-700">{route.name}</h3>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors shrink-0 mt-0.5" />
                </div>

                {/* Stops preview */}
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3 flex-wrap">
                  {route.stops.map((stop, i) => (
                    <span key={stop} className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary-400" />
                      <span>{stop}</span>
                      {i < route.stops.length - 1 && <span className="text-slate-300 mx-0.5">→</span>}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{route.departureTimes[0]}</span>
                    {route.departureTimes.length > 1 && (
                      <span className="text-slate-300">+{route.departureTimes.length - 1} more</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-500" />
                    <span className="font-semibold text-emerald-600">{route.availableSeats}</span>
                    <span className="text-slate-300">/ {route.totalSeats}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredRoutes.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-400">
              No routes found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Choose Seat */}
      {step === 2 && selectedRoute && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat map */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <h3 className="text-sm font-bold text-primary-900">{selectedRoute.name}</h3>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-100 border border-emerald-300" />
                <span className="text-slate-500">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-red-100 border border-red-300" />
                <span className="text-slate-500">Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-primary-500 border border-primary-600" />
                <span className="text-slate-500">Your Pick</span>
              </div>
            </div>

            {/* Bus front label */}
            <div className="flex justify-center mb-3">
              <div className="px-4 py-1.5 rounded-t-xl bg-slate-100 border border-b-0 border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BusIcon className="w-3.5 h-3.5" /> Front
              </div>
            </div>

            {/* Seat grid */}
            <div className="border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-y-2">
                {Array.from({ length: 12 }, (_, row) => {
                  const rowNum = row + 1;
                  const rowSeats = seats.filter((s) => s.row === rowNum);
                  const left = rowSeats.filter((s) => s.col === 'A' || s.col === 'B');
                  const right = rowSeats.filter((s) => s.col === 'C' || s.col === 'D');

                  const renderSeat = (seat: Seat) => {
                    const isSelected = selectedSeat === seat.id;
                    const isReserved = seat.status === 'reserved';
                    return (
                      <button
                        key={seat.id}
                        disabled={isReserved}
                        onClick={() => handleSelectSeat(seat.id)}
                        className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-primary-500 text-white border-2 border-primary-600 shadow-md shadow-primary-500/30 scale-105'
                            : isReserved
                            ? 'bg-red-100 text-red-400 border border-red-200 cursor-not-allowed'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 hover:scale-105'
                        }`}
                      >
                        {seat.id}
                      </button>
                    );
                  };

                  return (
                    <div key={rowNum} className="contents">
                      <div className="flex gap-1.5 justify-end">{left.map(renderSeat)}</div>
                      <div className="w-6" />
                      <div className="flex gap-1.5">{right.map(renderSeat)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Date & time */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h4 className="text-sm font-bold text-primary-900">Trip Details</h4>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Departure Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none cursor-pointer"
                >
                  {selectedRoute.departureTimes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Selection info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="text-sm font-bold text-primary-900 mb-3">Your Selection</h4>
              {selectedSeat ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seat</span>
                    <span className="font-bold text-primary-900">{selectedSeat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route</span>
                    <span className="font-medium text-primary-900">{selectedRoute.name.split(' — ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bus</span>
                    <span className="font-medium text-primary-900">{selectedRoute.assignedBus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time</span>
                    <span className="font-medium text-primary-900">{selectedTime}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300">Select a seat from the map.</p>
              )}

              <button
                disabled={!selectedSeat || !selectedDate}
                onClick={() => setStep(3)}
                className="w-full mt-4 px-5 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue to Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Confirm */}
      {step === 3 && selectedRoute && !confirmed && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to seat map
            </button>

            <h3 className="text-lg font-bold text-primary-900 mb-5">Reservation Summary</h3>

            <div className="space-y-3 text-sm">
              {[
                { label: 'Route', value: selectedRoute.name, icon: MapPin },
                { label: 'Bus', value: selectedRoute.assignedBus, icon: BusIcon },
                { label: 'Seat', value: selectedSeat!, icon: Ticket },
                { label: 'Date', value: selectedDate, icon: CalendarDays },
                { label: 'Departure', value: selectedTime, icon: Clock },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <item.icon className="w-4 h-4 text-primary-500 shrink-0" />
                  <div className="flex justify-between w-full">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-semibold text-primary-900">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-6 px-5 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              Confirm Reservation
            </button>
          </div>
        </div>
      )}

      {/* Success state */}
      {confirmed && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Seat Confirmed! 🎉</h3>
            <p className="text-sm text-slate-400 mb-6">
              Your reservation for seat <span className="font-bold text-primary-900">{selectedSeat}</span> on{' '}
              <span className="font-bold text-primary-900">{selectedRoute?.name}</span> has been confirmed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all"
              >
                Reserve Another
              </button>
              <button className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReserveASeat;

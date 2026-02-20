import { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Users, ArrowRight, Check, CalendarDays, Ticket, ChevronLeft, Bus as BusIcon, AlertTriangle, Pause, Play } from 'lucide-react';
import { availableRoutes, generateSeatMap, type Seat } from '../../data/passengerMockData';
import { useToast } from '../../context/ToastContext';
import { useSchedule, to12Hour, type GeneratedSlot } from '../../context/ScheduleContext';

type Step = 1 | 2 | 3;

const stepLabels = ['Choose Route', 'Choose Seat & Time', 'Confirm'];

const ReserveASeat = () => {
  const { toast } = useToast();
  const { config, generatedSlots, serviceStatus } = useSchedule();
  const [step, setStep] = useState<Step>(1);
  const [search, setSearch] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [seats] = useState<Seat[]>(() => generateSeatMap());
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<GeneratedSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [stepError, setStepError] = useState('');
  const [selectedBoardStop, setSelectedBoardStop] = useState('');
  const [selectedDropoffStop, setSelectedDropoffStop] = useState('');

  const selectedRoute = availableRoutes.find((r) => r.id === selectedRouteId);

  // Compute dropoff stops — only stops AFTER the selected boarding stop
  const dropoffStops = useMemo(() => {
    if (!selectedRoute || !selectedBoardStop) return [];
    const boardIndex = selectedRoute.stops.indexOf(selectedBoardStop);
    if (boardIndex < 0) return [];
    return selectedRoute.stops.slice(boardIndex + 1);
  }, [selectedRoute, selectedBoardStop]);

  const filteredRoutes = useMemo(() => {
    if (!search) return availableRoutes.filter((r) => r.status === 'Active');
    return availableRoutes.filter(
      (r) => r.status === 'Active' && r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id);
    setSelectedBoardStop('');
    setSelectedDropoffStop('');
    // Auto-select first active slot
    const firstActive = generatedSlots.find((s) => s.status === 'active');
    setSelectedSlot(firstActive || null);
    setStep(2);
  };

  const handleSelectSeat = (id: string) => {
    const seat = seats.find((s) => s.id === id);
    if (seat && seat.status === 'available') {
      setSelectedSeat(id);
      setStepError('');
    }
  };

  const handleContinueToConfirm = () => {
    if (!selectedSeat && !selectedDate && !selectedSlot) {
      setStepError('Please select a seat, time slot, and date to continue.');
      return;
    }
    if (!selectedSlot) {
      setStepError('Please select a departure time slot.');
      return;
    }
    if (!selectedBoardStop || !selectedDropoffStop) {
      setStepError('Please select your board at and drop off at stops.');
      return;
    }
    if (!selectedSeat) {
      setStepError('Please select a seat from the map.');
      return;
    }
    if (!selectedDate) {
      setStepError('Please pick a date for your trip.');
      return;
    }
    setStepError('');
    setStep(3);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    toast('Seat confirmed! 🎉');
  };

  const handleReset = () => {
    setStep(1);
    setSelectedRouteId(null);
    setSelectedSeat(null);
    setSelectedSlot(null);
    setSelectedDate('');
    setSelectedBoardStop('');
    setSelectedDropoffStop('');
    setConfirmed(false);
  };

  const isServiceRunning = serviceStatus.state === 'running';

  return (
    <div className="space-y-6">
      {/* Operating Hours Banner */}
      <div className={`rounded-2xl px-5 py-4 border ${
        serviceStatus.state === 'running'
          ? 'bg-emerald-50 border-emerald-200'
          : serviceStatus.state === 'break'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 shrink-0 ${
              serviceStatus.state === 'running' ? 'text-emerald-600' : serviceStatus.state === 'break' ? 'text-amber-600' : 'text-red-500'
            }`} />
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Operating hours: {to12Hour(config.operatingHours.startTime)} — {to12Hour(config.operatingHours.endTime)}
                {config.operatingHours.overnight && <span className="text-slate-400 ml-1">(overnight)</span>}
              </p>
              {serviceStatus.state === 'running' && (
                <p className="text-xs text-emerald-600">
                  Buses are running — Next departure at {serviceStatus.nextDeparture}
                </p>
              )}
              {serviceStatus.state === 'break' && (
                <p className="text-xs text-amber-600">
                  Break time — Buses resume at {serviceStatus.resumesAt}
                </p>
              )}
              {serviceStatus.state === 'ended' && (
                <p className="text-xs text-red-600">
                  Service ended — Resumes at {serviceStatus.resumesAt}
                </p>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            serviceStatus.state === 'running'
              ? 'bg-emerald-100 text-emerald-700'
              : serviceStatus.state === 'break'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              serviceStatus.state === 'running' ? 'bg-emerald-500 animate-pulse' : serviceStatus.state === 'break' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            {serviceStatus.state === 'running' ? 'Running' : serviceStatus.state === 'break' ? 'Break' : 'Offline'}
          </span>
        </div>
      </div>

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

                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3 flex-wrap">
                  {route.stops.slice(0, 3).map((stop, i) => (
                    <span key={stop + i} className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary-400" />
                      <span>{stop}</span>
                      {i < 2 && <span className="text-slate-300 mx-0.5">→</span>}
                    </span>
                  ))}
                  {route.stops.length > 3 && (
                    <span className="text-slate-300 ml-1">… +{route.stops.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-primary-600">{route.stops.length} stops</span>
                  <span>·</span>
                  <span>{route.stops[0]} → {route.stops[route.stops.length - 1]}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Every {config.frequencyMinutes} min</span>
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

      {/* Step 2 — Choose Seat & Time Slot */}
      {step === 2 && selectedRoute && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat map */}
          <div className="lg:col-span-2 space-y-4">
            {/* Time slot selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
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

              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Departure Time</h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {generatedSlots.map((slot, i) => {
                  const isSelected = selectedSlot?.time === slot.time;
                  const isStopped = slot.status === 'stopped';
                  const isFull = slot.status === 'active' && slot.availableSeats === 0;
                  const isDisabled = isStopped || isFull;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => { setSelectedSlot(slot); setStepError(''); }}
                      className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? 'bg-primary-50 border-primary-400 ring-2 ring-primary-500/20 shadow-md'
                          : isStopped
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                          : isFull
                          ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      {isStopped ? (
                        <Pause className="w-4 h-4 text-slate-300" />
                      ) : isFull ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Play className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className={`font-bold text-xs ${isSelected ? 'text-primary-900' : isStopped ? 'text-slate-400' : 'text-slate-700'}`}>
                        {slot.label}
                      </span>
                      {isStopped ? (
                        <span className="text-[10px] text-slate-300">Break</span>
                      ) : (
                        <span className={`text-[10px] ${isFull ? 'text-red-400' : 'text-emerald-500'}`}>
                          {isFull ? 'Full' : `${slot.availableSeats} seats`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seat map */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
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
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Trip details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h4 className="text-sm font-bold text-primary-900">Trip Details</h4>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Departure Time</label>
                <div className={`px-4 py-2.5 rounded-xl border text-sm font-medium ${
                  selectedSlot
                    ? 'border-primary-300 bg-primary-50 text-primary-800'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}>
                  {selectedSlot ? selectedSlot.label : 'Select a time slot above'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setStepError(''); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Board at</label>
                <select
                  value={selectedBoardStop}
                  onChange={(e) => {
                    setSelectedBoardStop(e.target.value);
                    setSelectedDropoffStop('');
                    setStepError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">Select boarding stop…</option>
                  {selectedRoute.stops.slice(0, -1).map((stop, i) => (
                    <option key={`board-${i}`} value={stop}>{i + 1}. {stop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Drop off at</label>
                <select
                  value={selectedDropoffStop}
                  onChange={(e) => { setSelectedDropoffStop(e.target.value); setStepError(''); }}
                  disabled={!selectedBoardStop}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{selectedBoardStop ? 'Select drop-off stop…' : 'Select boarding stop first'}</option>
                  {dropoffStops.map((stop, i) => {
                    const globalIndex = selectedRoute.stops.indexOf(stop);
                    return (
                      <option key={`drop-${i}`} value={stop}>{globalIndex + 1}. {stop}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Arrive at your stop on time. The bus will not wait. No pick-up or drop-off outside official stops.
              </p>
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
                    <span className="text-slate-400">Board at</span>
                    <span className="font-medium text-primary-900">{selectedBoardStop || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Drop off</span>
                    <span className="font-medium text-primary-900">{selectedDropoffStop || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time</span>
                    <span className="font-medium text-primary-900">{selectedSlot?.label || '—'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300">Select a seat from the map.</p>
              )}

              <button
                onClick={handleContinueToConfirm}
                className="w-full mt-4 px-5 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue to Confirm
              </button>
              {stepError && (
                <p className="mt-2 text-xs text-red-500 font-medium text-center">{stepError}</p>
              )}
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
                { label: 'Board at', value: selectedBoardStop, icon: MapPin },
                { label: 'Drop off at', value: selectedDropoffStop, icon: MapPin },
                { label: 'Bus', value: selectedRoute.assignedBus, icon: BusIcon },
                { label: 'Seat', value: selectedSeat!, icon: Ticket },
                { label: 'Date', value: selectedDate, icon: CalendarDays },
                { label: 'Departure', value: selectedSlot?.label || '—', icon: Clock },
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

            <div className="flex items-start gap-2 mt-4 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Arrive at your boarding stop on time. The bus will not wait beyond the scheduled departure.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-4 px-5 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
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

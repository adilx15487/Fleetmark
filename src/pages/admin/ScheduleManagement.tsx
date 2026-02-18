import { useState } from 'react';
import { Calendar, Plus, Clock, Bus as BusIcon, MapPin } from 'lucide-react';
import { weeklySchedule } from '../../data/mockData';
import Modal from '../../components/admin/Modal';

const ScheduleManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    route: '', bus: '', day: 'Monday', startTime: '', endTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add schedule slot:', formData);
    setModalOpen(false);
    setFormData({ route: '', bus: '', day: 'Monday', startTime: '', endTime: '' });
  };

  const totalSlots = weeklySchedule.reduce((sum, day) => sum + day.slots.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Weekly Schedule</h2>
          <p className="text-sm text-slate-400 mt-1">{totalSlots} active time slots this week</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add Time Slot
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {weeklySchedule.map((day) => (
          <div
            key={day.day}
            className={`bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:shadow-lg hover:shadow-primary-100/30 ${
              day.slots.length === 0 ? 'opacity-60' : ''
            }`}
          >
            {/* Day header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-bold text-primary-900">{day.day}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">{day.date}</span>
            </div>

            {/* Slots */}
            <div className="p-3 space-y-2 min-h-[120px]">
              {day.slots.length === 0 ? (
                <div className="flex items-center justify-center h-[100px] text-xs text-slate-300 font-medium">
                  No trips scheduled
                </div>
              ) : (
                day.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="relative pl-3 py-2.5 pr-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors group"
                  >
                    {/* Color indicator */}
                    <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${slot.color}`} />
                    <div className="ml-2">
                      <p className="text-xs font-bold text-primary-900">{slot.route}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <BusIcon className="w-3 h-3" />
                          {slot.bus}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {slot.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Route Color Legend */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-primary-900 mb-3">Route Legend</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { route: 'Route A', color: 'bg-primary-500' },
            { route: 'Route B', color: 'bg-accent-500' },
            { route: 'Route C', color: 'bg-emerald-500' },
            { route: 'Route D', color: 'bg-amber-500' },
            { route: 'Route E', color: 'bg-rose-500' },
          ].map((item) => (
            <div key={item.route} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs font-medium text-slate-600">{item.route}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Time Slot">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Route</label>
            <select
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all cursor-pointer"
            >
              <option value="">Select a route</option>
              <option value="Route A">Route A — Campus Express</option>
              <option value="Route B">Route B — Downtown Loop</option>
              <option value="Route C">Route C — Industrial Zone</option>
              <option value="Route D">Route D — Airport Shuttle</option>
              <option value="Route E">Route E — Medical Campus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bus</label>
            <input
              type="text"
              placeholder="e.g. Bus 07"
              value={formData.bus}
              onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Day</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all cursor-pointer"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
              <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
              <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all">Add Slot</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;

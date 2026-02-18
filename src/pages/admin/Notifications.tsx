import { useState, useMemo } from 'react';
import { Send, Info, CheckCircle, AlertTriangle, AlertCircle, Filter } from 'lucide-react';
import { notifications, type Notification } from '../../data/mockData';
import Modal from '../../components/admin/Modal';

const iconMap: Record<Notification['icon'], { Icon: typeof Info; color: string; bg: string }> = {
  info: { Icon: Info, color: 'text-sky-500', bg: 'bg-sky-50' },
  success: { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  warning: { Icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  alert: { Icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
};

type FilterType = 'All' | 'Unread' | 'Sent';

const Notifications = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ target: 'All Users', title: '', message: '' });

  const filtered = useMemo(() => {
    if (filter === 'All') return notifications;
    if (filter === 'Unread') return notifications.filter((n) => n.status === 'Unread');
    return notifications.filter((n) => n.type === 'sent');
  }, [filter]);

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Send notification:', formData);
    setModalOpen(false);
    setFormData({ target: 'All Users', title: '', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Notifications</h2>
          <p className="text-sm text-slate-400 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          Send Notification
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {(['All', 'Unread', 'Sent'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
            }`}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-400">
            No notifications to display.
          </div>
        ) : (
          filtered.map((n) => {
            const { Icon, color, bg } = iconMap[n.icon];
            return (
              <div
                key={n.id}
                className={`bg-white rounded-2xl border p-4 flex items-start gap-4 transition-all hover:shadow-lg hover:shadow-primary-100/30 ${
                  n.status === 'Unread'
                    ? 'border-primary-200 bg-primary-50/30'
                    : 'border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-primary-900">{n.title}</h3>
                    {n.status === 'Unread' && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                    )}
                    {n.type === 'sent' && (
                      <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider">Sent</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mt-0.5">{n.time}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Send Notification Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Send Notification">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Audience</label>
            <select
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all cursor-pointer"
            >
              <option>All Users</option>
              <option>Passengers Only</option>
              <option>Drivers Only</option>
              <option>Admins Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              placeholder="Notification title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
            <textarea
              placeholder="Write your notification message…"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all">Send</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notifications;

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { buses, type Bus } from '../../data/mockData';
import Modal from '../../components/admin/Modal';

const statusClasses: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  Maintenance: 'bg-amber-50 text-amber-600 border-amber-200',
};

const BusManagement = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', plateNumber: '', capacity: '', assignedRoute: '', driver: '', status: 'Active',
  });

  const filtered = buses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.driver.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add bus:', formData);
    setModalOpen(false);
    setFormData({ name: '', plateNumber: '', capacity: '', assignedRoute: '', driver: '', status: 'Active' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">All Buses</h2>
          <p className="text-sm text-slate-400 mt-1">{buses.length} buses registered</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 max-w-sm focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-400 transition-all">
        <Search className="w-4 h-4 text-slate-400 mr-3" />
        <input
          type="text"
          placeholder="Search buses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                {['Bus ID', 'Name', 'Capacity', 'Assigned Route', 'Driver', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-primary-600 font-semibold">{bus.id}</td>
                  <td className="px-5 py-3.5 font-medium text-primary-900 whitespace-nowrap">{bus.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{bus.capacity} seats</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{bus.assignedRoute}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{bus.driver}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusClasses[bus.status]}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-danger-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No buses found.</div>
        )}
      </div>

      {/* Add Bus Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Bus">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Bus Name', key: 'name', type: 'text', placeholder: 'e.g. Campus Cruiser' },
            { label: 'Plate Number', key: 'plateNumber', type: 'text', placeholder: 'e.g. A-1234-BC' },
            { label: 'Capacity', key: 'capacity', type: 'number', placeholder: 'e.g. 48' },
            { label: 'Assigned Route', key: 'assignedRoute', type: 'text', placeholder: 'e.g. Route A' },
            { label: 'Assigned Driver', key: 'driver', type: 'text', placeholder: 'e.g. Hassan Moukhtari' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={(formData as Record<string, string>)[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all">
              Add Bus
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BusManagement;

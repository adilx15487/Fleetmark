import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useBuses, useCreateBus, useDeleteBus } from '../../hooks/useApi';
import type { Bus } from '../../types/api';
import Modal from '../../components/admin/Modal';
import { SkeletonTable } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../lib/errorMapper';

const statusClasses: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  Maintenance: 'bg-amber-50 text-amber-600 border-amber-200',
};

interface FormErrors { [key: string]: string; }

const BusManagement = () => {
  const { data: buses = [], isLoading, isError, refetch } = useBuses();
  const createBus = useCreateBus();
  const deleteBus = useDeleteBus();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '', capacity: '', status: 'Active',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

  const filtered = buses.filter((b) =>
    b.matricule.toLowerCase().includes(search.toLowerCase()) ||
    String(b.id).includes(search)
  );

  const validateField = (key: string, value: string): string => {
    switch (key) {
      case 'matricule': return !value.trim() ? 'Matricule is required' : '';
      case 'capacity':
        if (!value.trim()) return 'Capacity is required';
        if (Number(value) <= 0) return 'Capacity must be greater than 0';
        return '';
      default: return '';
    }
  };

  const handleFieldBlur = (key: string) => {
    setFormTouched((p) => ({ ...p, [key]: true }));
    setFormErrors((p) => ({ ...p, [key]: validateField(key, (formData as Record<string, string>)[key]) }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (formTouched[key]) setFormErrors((p) => ({ ...p, [key]: validateField(key, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};
    const fields = ['matricule', 'capacity'];
    fields.forEach((k) => { errors[k] = validateField(k, (formData as Record<string, string>)[k]); });
    setFormErrors(errors);
    setFormTouched(Object.fromEntries(fields.map((k) => [k, true])));
    if (Object.values(errors).some((e) => e)) return;

    try {
      await createBus.mutateAsync({ matricule: formData.matricule, capacity: Number(formData.capacity) });
      toast('Bus added successfully!');
      setModalOpen(false);
      setFormData({ matricule: '', capacity: '', status: 'Active' });
      setFormErrors({});
      setFormTouched({});
    } catch (err) {
      toast(parseApiError(err).message);
    }
  };

  if (isLoading) return <SkeletonTable rows={6} cols={7} />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

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
                {['Bus ID', 'Matricule', 'Capacity', 'Status', 'Actions'].map((h) => (
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
                  <td className="px-5 py-3.5 font-medium text-primary-900 whitespace-nowrap">{bus.matricule}</td>
                  <td className="px-5 py-3.5 text-slate-500">{bus.capacity} seats</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusClasses['Active']}`}>
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await deleteBus.mutateAsync(bus.id);
                            toast('Bus deleted successfully!');
                          } catch (err) {
                            toast(parseApiError(err).message);
                          }
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-danger-500 hover:bg-red-50 transition-colors"
                      >
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
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setFormErrors({}); setFormTouched({}); }} title="Add New Bus">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Matricule', key: 'matricule', type: 'text', placeholder: 'e.g. X-0001-NS' },
            { label: 'Capacity', key: 'capacity', type: 'number', placeholder: 'e.g. 48' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={(formData as Record<string, string>)[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                onBlur={() => handleFieldBlur(field.key)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                  formTouched[field.key] && formErrors[field.key]
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                }`}
              />
              {formTouched[field.key] && formErrors[field.key] && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors[field.key]}</p>
              )}
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

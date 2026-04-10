import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';
import { Button, IconButton } from '../components/ui/Button';
import { Plus, Search, Edit2, Trash2, Filter, Loader2, AlertTriangle } from 'lucide-react';

/* ── helpers ── */
const EMPTY_FORM = { fullName: '', company: '', email: '', phone: '', status: 'Active' };

function validateForm(data) {
  const errors = {};
  if (!data.fullName.trim())             errors.fullName = 'Full name is required.';
  if (!data.company.trim())              errors.company  = 'Company is required.';
  if (!data.email.trim())                errors.email    = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                          errors.email    = 'Enter a valid email address.';
  return errors;
}

/* ── Field component ── */
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1"><AlertTriangle size={11} />{error}</p>}
    </div>
  );
}

const INPUT_CLS = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold placeholder:text-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all';

/* ═══════════════════════════════════════════
   Customers page
═══════════════════════════════════════════ */
export default function Customers() {
  const { addToast } = useUI();

  /* ── list state ── */
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  /* ── add/edit modal ── */
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // null = add mode
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ── delete confirmation ── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const firstFieldRef = useRef(null);

  /* ── load ── */
  const loadCustomers = useCallback(async () => {
    try {
      const data = await api.getCustomers(search);
      setCustomers(data);
    } catch {
      addToast('Failed to load customers.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, addToast]);

  useEffect(() => {
    setLoading(true);
    loadCustomers();
  }, [loadCustomers]);

  /* ── open add modal ── */
  const openAdd = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
    setTimeout(() => firstFieldRef.current?.focus(), 60);
  };

  /* ── open edit modal ── */
  const openEdit = (customer) => {
    setEditTarget(customer);
    setFormData({
      fullName: customer.fullName || customer.name || '',
      company:  customer.company  || '',
      email:    customer.email    || '',
      phone:    customer.phone    || '',
      status:   customer.status   || 'Active',
    });
    setErrors({});
    setModalOpen(true);
  };

  /* ── close modal ── */
  const closeModal = () => {
    if (submitting) return;     // block accidental close while saving
    setModalOpen(false);
    setEditTarget(null);
    setErrors({});
  };

  /* ── submit (add or edit) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;     // hard guard against double-submit

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (editTarget) {
        await api.updateCustomer(editTarget._id, formData);
        addToast('Customer updated successfully!', 'success');
      } else {
        await api.createCustomer(formData);
        addToast('Customer created successfully!', 'success');
      }
      setModalOpen(false);
      setEditTarget(null);
      setFormData(EMPTY_FORM);
      setErrors({});
      loadCustomers();
    } catch (err) {
      const msg = err?.response?.data?.message || (editTarget ? 'Failed to update customer.' : 'Failed to create customer.');
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await api.deleteCustomer(deleteTarget._id);
      addToast('Customer deleted.', 'info');
      setDeleteTarget(null);
      loadCustomers();
    } catch {
      addToast('Failed to delete customer.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key) => (e) => {
    setFormData(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  /* ── render ── */
  return (
    <Layout>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Relationship Management</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Customers</h2>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />} onClick={openAdd}>
          Add Customer
        </Button>
      </div>

      {/* ── Search bar ── */}
      <div className="flex items-center gap-3 mb-8 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
        <Search size={18} className="text-slate-300 shrink-0" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 py-2 bg-transparent border-none outline-none text-sm font-semibold placeholder:text-slate-300 text-slate-700"
        />
        <Button variant="ghost" size="sm" leftIcon={<Filter size={14} />}>Filter</Button>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] border-b border-slate-50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Created</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold text-sm">
                    No customers found.
                  </td>
                </tr>
              )}
              {customers.map(c => (
                <tr key={c._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-black text-blue-500 text-sm shrink-0">
                        {(c.fullName || c.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{c.fullName || c.name}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{c.email}</p>
                        <p className="text-xs text-slate-300 font-semibold">{c.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><StatusBadge status={c.status} /></td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-400">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        icon={<Edit2 size={15} />}
                        label={`Edit ${c.fullName || c.name}`}
                        variant="ghost" size="sm"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl"
                        onClick={() => openEdit(c)}
                      />
                      <IconButton
                        icon={<Trash2 size={15} />}
                        label={`Delete ${c.fullName || c.name}`}
                        variant="ghost" size="sm"
                        className="bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl"
                        onClick={() => setDeleteTarget(c)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ════════════════════════════════════════
          Add / Edit Customer Modal
      ════════════════════════════════════════ */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Customer' : 'Add New Customer'}
        subtitle={editTarget ? 'Update the customer record below.' : 'Fill in the details to create a new customer.'}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name *" error={errors.fullName}>
              <input
                ref={firstFieldRef}
                type="text"
                className={`${INPUT_CLS} ${errors.fullName ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
                placeholder="e.g. Jane Smith"
                value={formData.fullName}
                onChange={setField('fullName')}
                autoComplete="name"
              />
            </Field>
            <Field label="Company *" error={errors.company}>
              <input
                type="text"
                className={`${INPUT_CLS} ${errors.company ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
                placeholder="Acme Corp"
                value={formData.company}
                onChange={setField('company')}
              />
            </Field>
          </div>

          <Field label="Email Address *" error={errors.email}>
            <input
              type="email"
              className={`${INPUT_CLS} ${errors.email ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="jane@acme.com"
              value={formData.email}
              onChange={setField('email')}
              autoComplete="email"
            />
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              className={INPUT_CLS}
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={setField('phone')}
              autoComplete="tel"
            />
          </Field>

          <Field label="Status">
            <select
              className={INPUT_CLS}
              value={formData.status}
              onChange={setField('status')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </Field>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              {editTarget ? 'Save Changes' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ════════════════════════════════════════
          Delete Confirmation Modal
      ════════════════════════════════════════ */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete Customer"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 bg-rose-50 border border-rose-100 rounded-2xl p-5">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-rose-600" />
            </div>
            <p className="text-sm font-semibold text-rose-700 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong>{deleteTarget?.fullName || deleteTarget?.name}</strong>?
              All associated data will be removed.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button" variant="secondary" fullWidth
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button" variant="destructive" fullWidth
              loading={deleting}
              onClick={handleDelete}
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

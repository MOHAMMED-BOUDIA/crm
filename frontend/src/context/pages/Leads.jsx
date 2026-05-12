import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../services/api';
import { useUI } from '../../context/UIContext';
import { Button, IconButton } from '../../components/ui/Button';
import { 
  Plus, Globe, Link, Users, Mail, 
  Filter, Download, MoreVertical, Edit2, Trash2, AlertTriangle,
  ChevronLeft, ChevronRight, TrendingUp, Wallet, Clock, Loader2,
} from 'lucide-react';

/* ── helpers ── */
const EMPTY_FORM = { name: '', email: '', source: 'Website', status: 'New', value: '' };

function validateForm(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Name is required.';
  if (!data.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Enter a valid email address.';
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


const STATUS_FILTERS = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];

export default function Leads() {
  const { addToast } = useUI();
  const [leads,     setLeads]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  /* ── add/edit modal ── */
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ── delete confirmation ── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const firstFieldRef = useRef(null);

  /* ── load ── */
  const loadLeads = useCallback(async () => {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch {
      addToast('Failed to load leads.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    setLoading(true);
    loadLeads();
  }, [loadLeads]);

  /* ── open add modal ── */
  const openAdd = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
    setTimeout(() => firstFieldRef.current?.focus(), 60);
  };

  /* ── open edit modal ── */
  const openEdit = (lead) => {
    setEditTarget(lead);
    setFormData({
      name:   lead.name   || '',
      email:  lead.email  || '',
      source: lead.source || 'Website',
      status: lead.status || 'New',
      value:  String(lead.value ?? ''),
    });
    setErrors({});
    setModalOpen(true);
  };

  /* ── close modal ── */
  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditTarget(null);
    setErrors({});
  };

  /* ── submit (add or edit) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        value: Number(formData.value || 0),
      };

      if (editTarget) {
        await api.updateLead(editTarget._id, payload);
        addToast('Lead updated successfully!', 'success');
      } else {
        await api.createLead(payload);
        addToast('Lead created successfully!', 'success');
      }
      setModalOpen(false);
      setEditTarget(null);
      setFormData(EMPTY_FORM);
      setErrors({});
      loadLeads();
    } catch (err) {
      const msg = err?.response?.data?.message || (editTarget ? 'Failed to update lead.' : 'Failed to create lead.');
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
      await api.deleteLead(deleteTarget._id);
      addToast('Lead deleted.', 'info');
      setDeleteTarget(null);
      loadLeads();
    } catch {
      addToast('Failed to delete lead.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key) => (e) => {
    setFormData(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  const getSourceIcon = (src) => {
    if (src?.includes('Website'))  return <Globe size={14} />;
    if (src?.includes('LinkedIn')) return <Link  size={14} />;
    if (src?.includes('Referral')) return <Users size={14} />;
    return <Mail size={14} />;
  };

  const handleExport = () => {
    const csv = ['name,email,source,status,value', ...leads.map(l =>
      `"${l.name || ''}","${l.email || ''}","${l.source || ''}","${l.status || ''}","${l.value || 0}"`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('Leads exported to CSV!', 'success');
  };

  const filtered = activeTab === 'All' ? leads : leads.filter(l => l.status === activeTab);

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Leads</h2>
          <p className="text-slate-400 font-semibold mt-1.5 text-sm">Manage and nurture your sales pipeline prospects.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />} onClick={openAdd}>
          Add Lead
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(tab => (
            <Button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'primary' : 'secondary'}
              className="rounded-full px-5 py-2 text-xs tracking-wider shadow-none"
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={<Filter size={17} />}   label="Filter leads"  variant="secondary" size="sm" />
          <IconButton icon={<Download size={17} />} label="Export leads"  variant="secondary" size="sm" onClick={handleExport} />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100 mb-10">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] border-b border-slate-50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Lead Name</th>
                <th className="px-8 py-5">Source</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No leads found.</td></tr>
              )}
              {filtered.map(lead => (
                <tr key={lead._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                        {(lead.name || 'L').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{lead.name || 'Anonymous Lead'}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                      <span className="text-slate-400">{getSourceIcon(lead.source)}</span>
                      {lead.source || 'Direct'}
                    </div>
                  </td>
                  <td className="px-8 py-5"><StatusBadge status={lead.status} /></td>
                  <td className="px-8 py-5 font-black text-slate-900">{(lead.value || 0).toLocaleString()} DH</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                       <IconButton
                         icon={<Edit2 size={15} />}
                         label={`Edit ${lead.name}`}
                         variant="ghost" size="sm"
                         className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl"
                         onClick={() => openEdit(lead)}
                       />
                       <IconButton
                         icon={<Trash2 size={15} />}
                         label={`Delete ${lead.name}`}
                         variant="ghost" size="sm"
                         className="bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl"
                         onClick={() => setDeleteTarget(lead)}
                       />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-8 py-5 bg-[#fcfdfe] border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} leads</span>
            <div className="flex items-center gap-1">
              <IconButton icon={<ChevronLeft size={18} />}  label="Previous page" variant="secondary" size="sm" />
              <span className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg text-xs font-black shadow shadow-blue-500/20">1</span>
              <IconButton icon={<ChevronRight size={18} />} label="Next page"     variant="secondary" size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none"><TrendingUp size={80} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} /><span className="text-xs font-black uppercase tracking-widest text-blue-100">+12%</span></div>
            <h3 className="text-5xl font-black mb-1">{leads.length}</h3>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100/60">Total Leads</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4"><Wallet size={22} className="text-slate-400" /><span className="text-xs font-black uppercase tracking-widest text-emerald-500">Healthy</span></div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">{leads.reduce((s, l) => s + Number(l.value || 0), 0).toLocaleString()} DH</h3>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Value</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4"><Clock size={22} className="text-slate-400" /><span className="text-xs font-black uppercase tracking-widest text-blue-500">Avg Speed</span></div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">2.1d</h3>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Response Time</p>
        </div>
      </div>

      {/* ════════════════════════════════════════
          Add / Edit Lead Modal
      ════════════════════════════════════════ */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Lead' : 'Add New Lead'}
        subtitle={editTarget ? 'Update the lead record below.' : 'Fill in the details to capture a new lead.'}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label="Lead Name *" error={errors.name}>
            <input
              ref={firstFieldRef}
              type="text"
              className={`${INPUT_CLS} ${errors.name ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="e.g. Jane Smith"
              value={formData.name}
              onChange={setField('name')}
              autoComplete="name"
            />
          </Field>
          
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Source">
              <select className={INPUT_CLS} value={formData.source} onChange={setField('source')}>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Direct">Direct</option>
              </select>
            </Field>

            <Field label="Status">
              <select className={INPUT_CLS} value={formData.status} onChange={setField('status')}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </Field>
          </div>

          <Field label="Value (DH)">
            <input
              type="number"
              className={INPUT_CLS}
              placeholder="5000"
              value={formData.value === '' ? '' : formData.value}
              onChange={setField('value')}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              {editTarget ? 'Save Changes' : 'Create Lead'}
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
        title="Delete Lead"
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
              <strong>{deleteTarget?.name}</strong>?
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
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

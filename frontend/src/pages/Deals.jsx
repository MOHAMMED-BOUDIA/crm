import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';
import { Button, IconButton } from '../components/ui/Button';
import { Plus, MoreHorizontal, Loader2, Edit2, Trash2, AlertTriangle } from 'lucide-react';

const EMPTY_FORM = { title: '', company: '', value: 0, stage: 'Prospect' };

function validateForm(data) {
  const errors = {};
  if (!data.title.trim()) errors.title = 'Title is required.';
  if (!data.company.trim()) errors.company = 'Company is required.';
  return errors;
}

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

const STAGES = ['Prospect', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const STAGE_COLORS = {
  'Prospect':    'bg-slate-100 text-slate-600',
  'Proposal':    'bg-blue-50 text-blue-600',
  'Negotiation': 'bg-amber-50 text-amber-600',
  'Closed Won':  'bg-emerald-50 text-emerald-600',
  'Closed Lost': 'bg-rose-50 text-rose-500',
};

export default function Deals() {
  const { addToast } = useUI();
  const [deals,   setDeals]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const firstFieldRef = useRef(null);

  const loadDeals = useCallback(async () => {
    try {
      const data = await api.getDeals();
      setDeals(data);
    } catch {
      addToast('Failed to load deals.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    setLoading(true);
    loadDeals();
  }, [loadDeals]);

  const openAdd = (defaultStage = 'Prospect') => {
    setEditTarget(null);
    setFormData({ ...EMPTY_FORM, stage: defaultStage });
    setErrors({});
    setModalOpen(true);
    setTimeout(() => firstFieldRef.current?.focus(), 60);
  };

  const openEdit = (deal) => {
    setEditTarget(deal);
    setFormData({
      title:   deal.title   || '',
      company: deal.company || '',
      value:   deal.value   || 0,
      stage:   deal.stage   || 'Prospect',
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditTarget(null);
    setErrors({});
  };

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
      if (editTarget) {
        await api.updateDeal(editTarget._id, formData);
        addToast('Deal updated successfully!', 'success');
      } else {
        await api.createDeal(formData);
        addToast('Deal created successfully!', 'success');
      }
      setModalOpen(false);
      setEditTarget(null);
      setFormData(EMPTY_FORM);
      setErrors({});
      loadDeals();
    } catch (err) {
      const msg = err?.response?.data?.message || (editTarget ? 'Failed to update deal.' : 'Failed to create deal.');
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await api.deleteDeal(deleteTarget._id);
      addToast('Deal deleted.', 'info');
      setDeleteTarget(null);
      loadDeals();
    } catch {
      addToast('Failed to delete deal.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key) => (e) => {
    setFormData(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  const getStage = (name) => deals.filter(d => d.stage === name);
  const total    = deals.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Deals Pipeline</h2>
          <p className="text-slate-400 font-semibold mt-1 text-sm">
            Managing {deals.length} active deals across {STAGES.length} stages
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Pipeline</p>
            <p className="text-2xl font-black text-blue-600">DH{total.toLocaleString()}</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => openAdd('Prospect')}
          >
            New Deal
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 items-start">
          {STAGES.map(stage => {
            const stageDeals = getStage(stage);
            const stageTotal = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
            return (
              <div key={stage} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-black text-slate-900 text-sm">{stage}</h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{stageDeals.length}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">DH{stageTotal.toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  {stageDeals.map(deal => (
                    <div key={deal._id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 group cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-tight truncate">{deal.title}</h4>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">{deal.company}</p>
                        </div>
                        <div className="flex items-center gap-1 -mr-1.5 -mt-1 shrink-0">
                          <IconButton icon={<Edit2 size={14} />} label="Edit deal" variant="ghost" size="sm" onClick={() => openEdit(deal)} className="text-slate-400 hover:text-blue-600" />
                          <IconButton icon={<Trash2 size={14} />} label="Delete deal" variant="ghost" size="sm" onClick={() => setDeleteTarget(deal)} className="text-slate-400 hover:text-rose-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                        <span className="font-black text-slate-900 text-sm">DH{(deal.value || 0).toLocaleString()}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${STAGE_COLORS[stage] || 'bg-slate-100 text-slate-500'}`}>{stage}</span>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    leftIcon={<Plus size={16} />}
                    onClick={() => openAdd(stage)}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/20 rounded-[1.5rem] py-4"
                  >
                    Add Deal
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <IconButton
        icon={<Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />}
        variant="primary"
        shape="circle"
        label="Create deal"
        onClick={() => openAdd('Prospect')}
        className="fixed bottom-10 right-10 w-16 h-16 shadow-2xl shadow-blue-500/40 hover:scale-110 group"
      />
      {/* ════════════════════════════════════════
          Add / Edit Deal Modal
      ════════════════════════════════════════ */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Deal' : 'Add New Deal'}
        subtitle={editTarget ? 'Update the deal details below.' : 'Create a new pipeline deal.'}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label="Deal Title *" error={errors.title}>
            <input
              ref={firstFieldRef}
              type="text"
              className={`${INPUT_CLS} ${errors.title ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="e.g. Acme Corp Redesign"
              value={formData.title}
              onChange={setField('title')}
            />
          </Field>
          
          <Field label="Company *" error={errors.company}>
            <input
              type="text"
              className={`${INPUT_CLS} ${errors.company ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="e.g. Acme Corp"
              value={formData.company}
              onChange={setField('company')}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Stage">
              <select className={INPUT_CLS} value={formData.stage} onChange={setField('stage')}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Value (DH)">
              <input
                type="number"
                className={INPUT_CLS}
                placeholder="50000"
                value={formData.value}
                onChange={setField('value')}
              />
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              {editTarget ? 'Save Changes' : 'Create Deal'}
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
        title="Delete Deal"
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
              <strong>{deleteTarget?.title}</strong>?
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
              Delete Deal
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

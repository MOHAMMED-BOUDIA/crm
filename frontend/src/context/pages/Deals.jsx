import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { api } from '../../services/api';
import { useUI } from '../../context/UIContext';
import { Button, IconButton } from '../../components/ui/Button';
import { Plus, MoreHorizontal, Loader2, Edit2, Trash2, AlertTriangle, TrendingUp, Target, Zap, Filter, Search, Clock, AlertCircle } from 'lucide-react';

const EMPTY_FORM = { title: '', company: '', value: 0, stage: 'Prospect', probability: 50, priority: 'Medium' };

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
  'Prospect':    'bg-slate-100 text-slate-600 border-slate-200',
  'Proposal':    'bg-blue-50 text-blue-600 border-blue-200',
  'Negotiation': 'bg-amber-50 text-amber-600 border-amber-200',
  'Closed Won':  'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Closed Lost': 'bg-rose-50 text-rose-500 border-rose-200',
};

const PRIORITY_COLORS = {
  'High':   'bg-rose-50 border-rose-200 text-rose-700',
  'Medium': 'bg-amber-50 border-amber-200 text-amber-700',
  'Low':    'bg-slate-50 border-slate-200 text-slate-600',
};

const PROBABILITY_RANGES = [
  { min: 0, max: 25, label: 'Very Low', color: 'bg-rose-100 text-rose-700' },
  { min: 26, max: 50, label: 'Low', color: 'bg-amber-100 text-amber-700' },
  { min: 51, max: 75, label: 'High', color: 'bg-blue-100 text-blue-700' },
  { min: 76, max: 100, label: 'Very High', color: 'bg-emerald-100 text-emerald-700' },
];

export default function Deals() {
  const { addToast } = useUI();
  const [deals,   setDeals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

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
      title:       deal.title       || '',
      company:     deal.company     || '',
      value:       deal.value       || 0,
      stage:       deal.stage       || 'Prospect',
      probability: deal.probability ?? 50,
      priority:    deal.priority    || 'Medium',
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
      const payload = {
        ...formData,
        value: Number(formData.value) || 0,
        probability: Number(formData.probability) || 50,
      };
      
      if (editTarget) {
        await api.updateDeal(editTarget._id, payload);
        addToast('Deal updated successfully!', 'success');
      } else {
        await api.createDeal(payload);
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
    const value = key === 'probability' ? parseInt(e.target.value) : (key === 'value' ? parseFloat(e.target.value) : e.target.value);
    setFormData(p => ({ ...p, [key]: value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  // Filtering and sorting logic
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          deal.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'All' || deal.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch(sortBy) {
      case 'value-high': return (b.value || 0) - (a.value || 0);
      case 'value-low': return (a.value || 0) - (b.value || 0);
      case 'probability': return (b.probability || 0) - (a.probability || 0);
      case 'recent': return new Date(b.createdAt) - new Date(a.createdAt);
      default: return 0;
    }
  });

  const getStage = (name) => sortedDeals.filter(d => d.stage === name);
  const total = sortedDeals.reduce((s, d) => s + (d.value || 0), 0);
  const winRate = deals.length > 0 ? ((deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100).toFixed(1) : 0;

  const getProbabilityLabel = (prob) => {
    const range = PROBABILITY_RANGES.find(r => prob >= r.min && prob <= r.max);
    return range || PROBABILITY_RANGES[0];
  };

  return (
    <Layout>
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sales Pipeline</h2>
          <p className="text-slate-400 font-semibold mt-1.5 text-sm">Manage {deals.length} deals across 5 stages</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => { setEditTarget(null); setFormData(EMPTY_FORM); setErrors({}); setModalOpen(true); }}
        >
          New Deal
        </Button>
      </div>

      {/* ─── Advanced Stats Section ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pipeline Value</span>
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{total.toLocaleString()} DH</p>
          <p className="text-xs text-slate-400 font-semibold mt-2">Across all stages</p>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deal Count</span>
            <Target size={16} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{deals.length}</p>
          <p className="text-xs text-slate-400 font-semibold mt-2">{deals.filter(d => d.stage === 'Closed Won').length} won this quarter</p>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Win Rate</span>
            <Zap size={16} className="text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{winRate}%</p>
          <p className="text-xs text-slate-400 font-semibold mt-2">{deals.filter(d => d.stage === 'Closed Won').length} closed won</p>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg Deal Size</span>
            <AlertCircle size={16} className="text-violet-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{(deals.length > 0 ? (total / deals.length).toLocaleString() : 0)} DH</p>
          <p className="text-xs text-slate-400 font-semibold mt-2">Per opportunity</p>
        </div>
      </div>

      {/* ─── Search & Filters ─── */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by deal name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="All">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="recent">Recent</option>
              <option value="value-high">Value: High to Low</option>
              <option value="value-low">Value: Low to High</option>
              <option value="probability">Probability</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-semibold mt-3">Showing {sortedDeals.length} of {deals.length} deals</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : sortedDeals.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-400 font-semibold text-lg">No deals found</p>
          <p className="text-slate-300 text-sm mt-1">Try adjusting your filters or create a new deal</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 items-start">
          {STAGES.map(stage => {
            const stageDeals = getStage(stage);
            const stageTotal = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
            const stagePercentage = deals.length > 0 ? ((stageDeals.length / deals.length) * 100).toFixed(0) : 0;

            return (
              <div key={stage} className="flex-shrink-0 w-80">
                {/* Stage Header */}
                <div className={`rounded-t-2xl px-5 py-4 border-b-2 ${STAGE_COLORS[stage]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-sm flex items-center gap-2">
                      {stage}
                      <span className="bg-white bg-opacity-50 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {stageDeals.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-wider">Value</p>
                      <p className="text-lg font-black">{stageTotal.toLocaleString()} DH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-wider">% Total</p>
                      <p className="text-lg font-black">{stagePercentage}%</p>
                    </div>
                  </div>
                </div>

                {/* Deal Cards */}
                <div className="bg-slate-50 rounded-b-2xl p-4 space-y-3 min-h-96">
                  {stageDeals.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-center">
                      <p className="text-sm text-slate-400 font-semibold">No deals in this stage</p>
                    </div>
                  ) : (
                    stageDeals.map(deal => {
                      const probLabel = getProbabilityLabel(deal.probability || 50);
                      return (
                        <div key={deal._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                          {/* Deal Title & Actions */}
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                                {deal.title}
                              </h4>
                              <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">
                                {deal.company}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 -mr-2 -mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <IconButton icon={<Edit2 size={14} />} label="Edit" variant="ghost" size="sm" onClick={() => openEdit(deal)} className="text-slate-400 hover:text-blue-600" />
                              <IconButton icon={<Trash2 size={14} />} label="Delete" variant="ghost" size="sm" onClick={() => setDeleteTarget(deal)} className="text-slate-400 hover:text-rose-600" />
                            </div>
                          </div>

                          {/* Deal Value */}
                          <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3 border border-blue-100">
                            <p className="text-xs font-black text-blue-600 uppercase tracking-wider">Deal Value</p>
                            <p className="text-lg font-black text-slate-900">{(deal.value || 0).toLocaleString()} DH</p>
                          </div>

                          {/* Probability & Priority Row */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`flex-1 text-center px-2 py-1 rounded-lg border text-[10px] font-black ${probLabel.color}`}>
                              {deal.probability || 50}% {probLabel.label}
                            </div>
                            <div className={`flex-1 text-center px-2 py-1 rounded-lg border text-[10px] font-black ${PRIORITY_COLORS[deal.priority || 'Medium']}`}>
                              {deal.priority || 'Medium'}
                            </div>
                          </div>

                          {/* Probability Bar */}
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${deal.probability || 50}%` }}
                            />
                          </div>

                          {/* Stage Badge */}
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <span className={`inline-block text-[10px] font-black px-3 py-1.5 rounded-lg border ${STAGE_COLORS[stage]}`}>
                              {stage}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Add Deal Button */}
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    leftIcon={<Plus size={16} />}
                    onClick={() => { setEditTarget(null); setFormData({ ...EMPTY_FORM, stage }); setErrors({}); setModalOpen(true); }}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 rounded-xl py-3 text-slate-500 mt-2"
                  >
                    Add Deal
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════
          Add / Edit Deal Modal
      ════════════════════════════════════════ */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Deal' : 'Create New Deal'}
        subtitle={editTarget ? 'Update the deal details and progress.' : 'Add a new sales opportunity to your pipeline.'}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label="Deal Title *" error={errors.title}>
            <input
              ref={firstFieldRef}
              type="text"
              className={`${INPUT_CLS} ${errors.title ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="e.g. Acme Corp Platform Redesign"
              value={formData.title}
              onChange={setField('title')}
            />
          </Field>
          
          <Field label="Company Name *" error={errors.company}>
            <input
              type="text"
              className={`${INPUT_CLS} ${errors.company ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="e.g. Acme Corporation"
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

            <Field label="Deal Value (DH)">
              <input
                type="number"
                className={INPUT_CLS}
                placeholder="50000"
                value={formData.value}
                onChange={setField('value')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Win Probability (%)">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.probability || 50}
                  onChange={setField('probability')}
                  className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-black text-blue-600 w-10 text-right">{formData.probability || 50}%</span>
              </div>
            </Field>

            <Field label="Priority">
              <select className={INPUT_CLS} value={formData.priority || 'Medium'} onChange={setField('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
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

import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';
import { Button, IconButton } from '../components/ui/Button';
import { 
  Plus, Calendar, Filter, ChevronLeft, ChevronRight,
  TrendingUp, Target, Loader2, Edit2, Trash2, AlertTriangle
} from 'lucide-react';

const EMPTY_FORM = { title: '', desc: '', date: '', priority: 'Low', deal: '' };

function validateForm(data) {
  const errors = {};
  if (!data.title.trim()) errors.title = 'Title is required.';
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

const PRIORITY_STYLES = {
  Critical: 'bg-rose-50 text-rose-600',
  High:     'bg-amber-50 text-amber-600',
  Medium:   'bg-blue-50 text-blue-600',
  Low:      'bg-slate-100 text-slate-500',
};

const TABS = [
  { name: 'Today',     count: 12 },
  { name: 'This week', count: 24 },
  { name: 'Overdue',   count: 3  },
  { name: 'Completed', count: 0  },
];

export default function Tasks() {
  const { addToast } = useUI();
  const [activeTab,   setActiveTab]   = useState('All');
  const [checked,     setChecked]     = useState(new Set());
  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const firstFieldRef = useRef(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch {
      addToast('Failed to load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [loadTasks]);

  const openAdd = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
    setTimeout(() => firstFieldRef.current?.focus(), 60);
  };

  const openEdit = (task) => {
    setEditTarget(task);
    setFormData({
      title:    task.title    || '',
      desc:     task.desc     || '',
      date:     task.date     || '',
      priority: task.priority || 'Low',
      deal:     task.deal     || '',
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
        await api.updateTask(editTarget._id, formData);
        addToast('Task updated successfully!', 'success');
      } else {
        await api.createTask(formData);
        addToast('Task created successfully!', 'success');
      }
      setModalOpen(false);
      setEditTarget(null);
      setFormData(EMPTY_FORM);
      setErrors({});
      loadTasks();
    } catch (err) {
      const msg = err?.response?.data?.message || (editTarget ? 'Failed to update task.' : 'Failed to create task.');
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await api.deleteTask(deleteTarget._id);
      addToast('Task deleted.', 'info');
      setDeleteTarget(null);
      loadTasks();
    } catch {
      addToast('Failed to delete task.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key) => (e) => {
    setFormData(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  const toggle = (id) => setChecked(s => {
    const n = new Set(s);
    if (n.has(id)) { n.delete(id); } else { n.add(id); addToast('Task marked complete!', 'success'); }
    return n;
  });

  // Filter tasks locally (simplified approach)
  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'Completed') return checked.has(t._id);
    if (activeTab === 'Pending')   return !checked.has(t._id);
    return true; // 'All'
  });

  const TABS = [
    { name: 'All',       count: tasks.length },
    { name: 'Pending',   count: tasks.filter(t => !checked.has(t._id)).length },
    { name: 'Completed', count: checked.size },
  ];

  const totalTasks = tasks.length || 1;
  const completedCount = checked.size;
  const completionRate = Math.round((completedCount / totalTasks) * 100);
  
  // Calculate top focus client based on priority string checking
  const focusDeal = tasks.find(t => t.priority === 'Critical' && !checked.has(t._id))?.deal || 'No current threats';

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tasks</h2>
          <p className="text-slate-400 font-semibold mt-1.5 text-sm">Manage your daily workflow and client follow-ups.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />} onClick={openAdd}>
          Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map(tab => (
            <Button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              variant={activeTab === tab.name ? 'primary' : 'secondary'}
              className="rounded-full px-5 py-2.5 shadow-none"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
                {tab.name}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    activeTab === tab.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{tab.count}</span>
                )}
              </div>
            </Button>
          ))}
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Filter size={14} />}>Filters</Button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
        <table className="w-full text-left">
          <thead className="bg-[#fcfdfe] border-b border-slate-50">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-5 w-12"></th>
              <th className="px-6 py-5">Task</th>
              <th className="px-6 py-5">Due Date</th>
              <th className="px-6 py-5">Priority</th>
              <th className="px-6 py-5">Related Deal</th>
              <th className="px-6 py-5 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400 font-bold">Loading tasks...</td></tr>
            ) : filteredTasks.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400 font-bold">No tasks found.</td></tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task._id} className={`group transition-colors ${checked.has(task._id) ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={checked.has(task._id)}
                      onChange={() => toggle(task._id)}
                      className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 cursor-pointer accent-blue-600"
                      aria-label={`Mark "${task.title}" as complete`}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <p className={`font-bold text-sm leading-tight transition-colors ${checked.has(task._id) ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-blue-600'}`}>{task.title}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1">{task.desc}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 text-sm font-bold ${task.overdue ? 'text-rose-500' : 'text-slate-400'}`}>
                      <Calendar size={15} /> {task.date || 'No Date'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low}`}>
                      {task.priority || 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-slate-100 rounded-lg overflow-hidden shrink-0"><div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400" /></div>
                      <span className="text-sm font-bold text-slate-700 truncate max-w-[140px]">{task.deal || 'No Deal'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton icon={<Edit2 size={14} />} label="Edit" variant="ghost" size="sm" onClick={() => openEdit(task)} className="text-slate-400 hover:text-blue-600" />
                    <IconButton icon={<Trash2 size={14} />} label="Delete" variant="ghost" size="sm" onClick={() => setDeleteTarget(task)} className="text-slate-400 hover:text-rose-600" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-5 bg-[#fcfdfe] border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Showing {filteredTasks.length} tasks</span>
          <div className="flex items-center gap-2">
            <IconButton icon={<ChevronLeft size={16} />}  label="Previous page" variant="secondary" size="sm" />
            <IconButton icon={<ChevronRight size={16} />} label="Next page"     variant="secondary" size="sm" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Completion Rate</p>
            <h3 className="text-4xl font-black text-blue-600 mb-1">{tasks.length ? completionRate : 0}%</h3>
            <p className="text-xs font-black text-slate-400 flex items-center gap-1">Based on global check marks</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform pointer-events-none"><TrendingUp size={110} className="text-blue-600" /></div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Focus Client</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shrink-0" />
            <div>
              <p className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate max-w-[120px]">{focusDeal}</p>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Critical pending</p>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 rotate-12 group-hover:rotate-0 transition-transform pointer-events-none"><Target size={110} className="text-indigo-600" /></div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Progress Tracker</p>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/30" style={{ width: `${tasks.length ? completionRate : 0}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">{completedCount} of {tasks.length} tasks done</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tasks.length ? completionRate : 0}%</span>
          </div>
        </div>
      </div>
      {/* ════════════════════════════════════════
          Add / Edit Task Modal
      ════════════════════════════════════════ */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Task' : 'Add New Task'}
        subtitle={editTarget ? 'Update the task details below.' : 'Create a new action item.'}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label="Task Title *" error={errors.title}>
            <input
              ref={firstFieldRef}
              type="text"
              className={`${INPUT_CLS} ${errors.title ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`}
              placeholder="e.g. Call Client"
              value={formData.title}
              onChange={setField('title')}
            />
          </Field>
          
          <Field label="Description">
            <input
              type="text"
              className={INPUT_CLS}
              placeholder="e.g. Finalize contract"
              value={formData.desc}
              onChange={setField('desc')}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Due Date">
              <input
                type="text"
                className={INPUT_CLS}
                placeholder="e.g. Tomorrow"
                value={formData.date}
                onChange={setField('date')}
              />
            </Field>

            <Field label="Priority">
              <select className={INPUT_CLS} value={formData.priority} onChange={setField('priority')}>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </Field>
          </div>

          <Field label="Related Deal">
            <input
              type="text"
              className={INPUT_CLS}
              placeholder="e.g. Acme Corp Redesign"
              value={formData.deal}
              onChange={setField('deal')}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              {editTarget ? 'Save Changes' : 'Create Task'}
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
        title="Delete Task"
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
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

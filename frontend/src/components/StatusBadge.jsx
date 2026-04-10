const STYLES = {
  // Customer
  'Active':      'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Inactive':    'bg-slate-100  text-slate-600   border-slate-200',

  // Lead
  'New':         'bg-blue-50   text-blue-700    border-blue-100',
  'Contacted':   'bg-amber-50  text-amber-700   border-amber-100',
  'Qualified':   'bg-violet-50 text-violet-700  border-violet-100',
  'Converted':   'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Lost':        'bg-slate-100 text-slate-500   border-slate-200',

  // Deal stage
  'Prospect':    'bg-blue-50   text-blue-600    border-blue-100',
  'Proposal':    'bg-violet-50 text-violet-600  border-violet-100',
  'Negotiation': 'bg-amber-50  text-amber-600   border-amber-100',
  'Closed Won':  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Closed Lost': 'bg-rose-50   text-rose-600    border-rose-100',

  // Priority
  'Critical':    'bg-rose-50   text-rose-700    border-rose-100',
  'High':        'bg-orange-50 text-orange-700  border-orange-100',
  'Medium':      'bg-amber-50  text-amber-600   border-amber-100',
  'Low':         'bg-slate-100 text-slate-500   border-slate-200',
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] ?? 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

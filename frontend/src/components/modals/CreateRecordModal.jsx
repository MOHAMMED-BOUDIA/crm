import { useNavigate } from 'react-router-dom';
import { Users, Target, Handshake, CheckCircle2, X } from 'lucide-react';
import Modal from '../Modal';
import { Button } from '../ui/Button';

const RECORD_TYPES = [
  { label: 'Customer',  icon: Users,        path: '/customers',  color: 'bg-blue-50 text-blue-600',   border: 'hover:border-blue-200' },
  { label: 'Lead',      icon: Target,       path: '/leads',      color: 'bg-violet-50 text-violet-600', border: 'hover:border-violet-200' },
  { label: 'Deal',      icon: Handshake,    path: '/deals',      color: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-200' },
  { label: 'Task',      icon: CheckCircle2, path: '/tasks',      color: 'bg-amber-50 text-amber-600',  border: 'hover:border-amber-200' },
];

export default function CreateRecordModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="Create New Record" subtitle="Choose what you'd like to create.">
      <div className="grid grid-cols-2 gap-3 pb-2">
        {RECORD_TYPES.map(({ label, icon: Icon, path, color, border }) => (
          <Button
            key={label}
            variant="ghost"
            onClick={() => handleSelect(path)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 ${border} bg-white hover:shadow-md transition-all duration-200 group h-auto`}
          >
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon size={22} />
            </div>
            <span className="font-black text-slate-800 text-sm whitespace-normal">{label}</span>
          </Button>
        ))}
      </div>
    </Modal>
  );
}

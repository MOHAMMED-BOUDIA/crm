import { useState } from 'react';
import { MessageSquare, Book, ChevronDown, ChevronUp, Mail, Phone, Send } from 'lucide-react';
import Modal from '../Modal';
import { Button } from '../ui/Button';
import { useUI } from '../../context/UIContext';

const FAQS = [
  { q: 'How do I add a new customer?', a: 'Go to Customers page and click "Add Customer". Fill in the required fields and submit.' },
  { q: 'How do I export data?', a: 'Click the "Export Intelligence" button on the Dashboard to download your data as a CSV file.' },
  { q: 'How do I change my password?', a: 'Go to Settings → Security and use the Password Update section.' },
  { q: 'What does the pipeline value represent?', a: 'It represents the total monetary value of all active deals across all pipeline stages.' },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors h-auto rounded-none"
      >
        <span className="font-bold text-sm text-slate-800">{faq.q}</span>
        {open ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </Button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 bg-slate-50/50">
          <p className="pt-3">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportModal({ isOpen, onClose }) {
  const [msg, setMsg] = useState('');
  const { addToast } = useUI();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Support Center" subtitle="Find answers or reach our team.">
      <div className="space-y-6">
        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Book size={16} className="text-slate-400" />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Frequently Asked</p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-slate-400" />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Contact Support</p>
          </div>
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={3}
            placeholder="Describe your issue..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all border-box"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            leftIcon={<Send size={16} />}
            onClick={() => {
              if (!msg.trim()) return addToast('Please enter a message first.', 'error');
              addToast('Support request sent! We will contact you soon.', 'success');
              setMsg('');
              onClose();
            }}
          >
            Send Message
          </Button>
        </div>
      </div>
    </Modal>
  );
}

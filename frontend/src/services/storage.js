const KEYS = {
  CUSTOMERS: 'crm_customers',
  LEADS: 'crm_leads',
  DEALS: 'crm_deals',
  TASKS: 'crm_tasks',
  TOKEN: 'crm_token',
};

const INITIAL_DATA = {
  customers: [
    { id: '1', fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'Tech Corp', status: 'Active' },
    { id: '2', fullName: 'Jane Smith', email: 'jane@smith.com', phone: '098-765-4321', company: 'Design Studio', status: 'Active' },
    { id: '3', fullName: 'Mike Ross', email: 'mike@ross.com', phone: '555-123-4567', company: 'Law Firm', status: 'Inactive' },
  ],
  leads: [
    { id: '1', name: 'Alice Walker', status: 'New', source: 'Website', value: 5000 },
    { id: '2', name: 'Bob Harris', status: 'Contacted', source: 'Referral', value: 12000 },
    { id: '3', name: 'Charlie Day', status: 'Qualified', source: 'LinkedIn', value: 8500 },
  ],
  deals: [
    { id: '1', title: 'Enterprise Software', stage: 'Negotiation', value: 25000 },
    { id: '2', title: 'Brand Identity', stage: 'Proposal', value: 5000 },
    { id: '3', title: 'Consulting Project', stage: 'Won', value: 15000 },
  ],
  tasks: [
    { id: '1', title: 'Call with John', dueDate: '2026-04-12', priority: 'High', completed: false },
    { id: '2', title: 'Send proposal', dueDate: '2026-04-15', priority: 'Medium', completed: false },
    { id: '3', title: 'Review contract', dueDate: '2026-04-10', priority: 'Low', completed: true },
  ],
};

export const storage = {
  init() {
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_DATA.customers));
    }
    if (!localStorage.getItem(KEYS.LEADS)) {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_DATA.leads));
    }
    if (!localStorage.getItem(KEYS.DEALS)) {
      localStorage.setItem(KEYS.DEALS, JSON.stringify(INITIAL_DATA.deals));
    }
    if (!localStorage.getItem(KEYS.TASKS)) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_DATA.tasks));
    }
  },

  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  KEYS
};

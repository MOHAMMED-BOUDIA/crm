import axios from 'axios';

const BASE_URL = '/api';

const client = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for development
const MOCK_CREDENTIALS = {
  'admin@crm.com': 'password123',
  'admin@company.com': 'password123',
};

const createMockUser = (email) => ({
  token: 'mock-jwt-token-' + Date.now(),
  email,
  name: 'Admin User',
  role: 'Admin',
  company: 'CRM Pro',
});

// Mock storage for development
const MOCK_STORAGE = {
  customers: [
    { id: 1, fullName: 'John Doe', company: 'Tech Corp', email: 'john@techcorp.com', phone: '555-0101', status: 'Active' },
    { id: 2, fullName: 'Jane Smith', company: 'Innovation Inc', email: 'jane@innov.com', phone: '555-0102', status: 'Active' },
  ],
  leads: [
    { id: 1, name: 'Lead One', email: 'lead1@email.com', source: 'Website', status: 'New', value: '$50,000' },
    { id: 2, name: 'Lead Two', email: 'lead2@email.com', source: 'Referral', status: 'Contacted', value: '$75,000' },
  ],
  deals: [
    { id: 1, title: 'Enterprise Deal', company: 'Big Corp', value: 150000, stage: 'Proposal', probability: 75, priority: 'High' },
    { id: 2, title: 'SMB Deal', company: 'Small Inc', value: 50000, stage: 'Negotiation', probability: 50, priority: 'Medium' },
  ],
  tasks: [
    { id: 1, title: 'Follow up with client', desc: 'Call John about proposal', date: '2025-05-20', priority: 'High', deal: 'Enterprise Deal', completed: false },
    { id: 2, title: 'Prepare presentation', desc: 'Create deck for Big Corp', date: '2025-05-22', priority: 'Medium', deal: 'Enterprise Deal', completed: false },
  ],
  stats: {
    totalCustomers: 48,
    activeDeals: 12,
    pendingTasks: 7,
    monthlyRevenue: '$524,000',
  }
};

export const api = {
  // Auth
  async login(credentials) {
    try {
      const { data } = await client.post('/auth/login', credentials);
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data));
      return data;
    } catch (err) {
      // Fallback to mock authentication if backend is unavailable
      if (MOCK_CREDENTIALS[credentials.email] === credentials.password) {
        const userData = createMockUser(credentials.email);
        localStorage.setItem('crm_token', userData.token);
        localStorage.setItem('crm_user', JSON.stringify(userData));
        return userData;
      }
      throw err;
    }
  },
  
  logout() {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('crm_token');
  },

  // Dashboard
  async getStats() {
    try {
      const { data } = await client.get('/dashboard/stats');
      return data;
    } catch {
      return MOCK_STORAGE.stats;
    }
  },

  async executeStrategy() {
    try {
      const { data } = await client.post('/dashboard/execute-strategy');
      return data;
    } catch {
      return { success: true, message: 'Strategy executed (mock)' };
    }
  },

  // Customers
  async getCustomers(search = '') {
    try {
      const { data } = await client.get(`/customers?search=${search}`);
      return data;
    } catch {
      if (!search) return MOCK_STORAGE.customers;
      return MOCK_STORAGE.customers.filter(c => 
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
      );
    }
  },
  async createCustomer(customerData) {
    try {
      const { data } = await client.post('/customers', customerData);
      return data;
    } catch {
      const newCustomer = { id: Date.now(), ...customerData };
      MOCK_STORAGE.customers.push(newCustomer);
      return newCustomer;
    }
  },
  async updateCustomer(id, customerData) {
    try {
      const { data } = await client.put(`/customers/${id}`, customerData);
      return data;
    } catch {
      const index = MOCK_STORAGE.customers.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_STORAGE.customers[index] = { ...MOCK_STORAGE.customers[index], ...customerData };
        return MOCK_STORAGE.customers[index];
      }
      return customerData;
    }
  },
  async deleteCustomer(id) {
    try {
      const { data } = await client.delete(`/customers/${id}`);
      return data;
    } catch {
      MOCK_STORAGE.customers = MOCK_STORAGE.customers.filter(c => c.id !== id);
      return { success: true };
    }
  },

  // Leads
  async getLeads() {
    try {
      const { data } = await client.get('/leads');
      return data;
    } catch {
      return MOCK_STORAGE.leads;
    }
  },
  async createLead(leadData) {
    try {
      const { data } = await client.post('/leads', leadData);
      return data;
    } catch {
      const newLead = { id: Date.now(), ...leadData };
      MOCK_STORAGE.leads.push(newLead);
      return newLead;
    }
  },
  async updateLead(id, leadData) {
    try {
      const { data } = await client.put(`/leads/${id}`, leadData);
      return data;
    } catch {
      const index = MOCK_STORAGE.leads.findIndex(l => l.id === id);
      if (index !== -1) {
        MOCK_STORAGE.leads[index] = { ...MOCK_STORAGE.leads[index], ...leadData };
        return MOCK_STORAGE.leads[index];
      }
      return leadData;
    }
  },
  async deleteLead(id) {
    try {
      const { data } = await client.delete(`/leads/${id}`);
      return data;
    } catch {
      MOCK_STORAGE.leads = MOCK_STORAGE.leads.filter(l => l.id !== id);
      return { success: true };
    }
  },

  // Deals
  async getDeals() {
    try {
      const { data } = await client.get('/deals');
      return data;
    } catch {
      return MOCK_STORAGE.deals;
    }
  },
  async createDeal(dealData) {
    try {
      const { data } = await client.post('/deals', dealData);
      return data;
    } catch {
      const newDeal = { id: Date.now(), ...dealData };
      MOCK_STORAGE.deals.push(newDeal);
      return newDeal;
    }
  },
  async updateDeal(id, dealData) {
    try {
      const { data } = await client.put(`/deals/${id}`, dealData);
      return data;
    } catch {
      const index = MOCK_STORAGE.deals.findIndex(d => d.id === id);
      if (index !== -1) {
        MOCK_STORAGE.deals[index] = { ...MOCK_STORAGE.deals[index], ...dealData };
        return MOCK_STORAGE.deals[index];
      }
      return dealData;
    }
  },
  async deleteDeal(id) {
    try {
      const { data } = await client.delete(`/deals/${id}`);
      return data;
    } catch {
      MOCK_STORAGE.deals = MOCK_STORAGE.deals.filter(d => d.id !== id);
      return { success: true };
    }
  },

  // Tasks
  async getTasks() {
    try {
      const { data } = await client.get('/tasks');
      return data;
    } catch {
      return MOCK_STORAGE.tasks;
    }
  },
  async createTask(taskData) {
    try {
      const { data } = await client.post('/tasks', taskData);
      return data;
    } catch {
      const newTask = { id: Date.now(), ...taskData, completed: false };
      MOCK_STORAGE.tasks.push(newTask);
      return newTask;
    }
  },
  async updateTask(id, taskData) {
    try {
      const { data } = await client.put(`/tasks/${id}`, taskData);
      return data;
    } catch {
      const index = MOCK_STORAGE.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        MOCK_STORAGE.tasks[index] = { ...MOCK_STORAGE.tasks[index], ...taskData };
        return MOCK_STORAGE.tasks[index];
      }
      return taskData;
    }
  },
  async deleteTask(id) {
    try {
      const { data } = await client.delete(`/tasks/${id}`);
      return data;
    } catch {
      MOCK_STORAGE.tasks = MOCK_STORAGE.tasks.filter(t => t.id !== id);
      return { success: true };
    }
  }
};

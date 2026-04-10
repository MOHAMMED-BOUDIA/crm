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

export const api = {
  // Auth
  async login(credentials) {
    const { data } = await client.post('/auth/login', credentials);
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_user', JSON.stringify(data));
    return data;
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
    const { data } = await client.get('/dashboard/stats');
    return data;
  },

  // Customers
  async getCustomers(search = '') {
    const { data } = await client.get(`/customers?search=${search}`);
    return data;
  },
  async createCustomer(customerData) {
    const { data } = await client.post('/customers', customerData);
    return data;
  },
  async updateCustomer(id, customerData) {
    const { data } = await client.put(`/customers/${id}`, customerData);
    return data;
  },
  async deleteCustomer(id) {
    const { data } = await client.delete(`/customers/${id}`);
    return data;
  },

  // Leads
  async getLeads() {
    const { data } = await client.get('/leads');
    return data;
  },
  async createLead(leadData) {
    const { data } = await client.post('/leads', leadData);
    return data;
  },
  async updateLead(id, leadData) {
    const { data } = await client.put(`/leads/${id}`, leadData);
    return data;
  },
  async deleteLead(id) {
    const { data } = await client.delete(`/leads/${id}`);
    return data;
  },

  // Deals
  async getDeals() {
    const { data } = await client.get('/deals');
    return data;
  },
  async createDeal(dealData) {
    const { data } = await client.post('/deals', dealData);
    return data;
  },
  async updateDeal(id, dealData) {
    const { data } = await client.put(`/deals/${id}`, dealData);
    return data;
  },
  async deleteDeal(id) {
    const { data } = await client.delete(`/deals/${id}`);
    return data;
  },

  // Tasks
  async getTasks() {
    const { data } = await client.get('/tasks');
    return data;
  },
  async createTask(taskData) {
    const { data } = await client.post('/tasks', taskData);
    return data;
  },
  async updateTask(id, taskData) {
    const { data } = await client.put(`/tasks/${id}`, taskData);
    return data;
  },
  async deleteTask(id) {
    const { data } = await client.delete(`/tasks/${id}`);
    return data;
  }
};

import '../storageMigration';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer, CustomerStatus, CustomerTier } from '../../types/crm';
import { initialCustomers } from '../mockData';

interface CustomersState {
  customers: Customer[];
  selectedCustomerId: string | null;
  drawerOpen: boolean;
  filterStatus: CustomerStatus | 'All';
  filterTier: CustomerTier | 'All';
  searchQuery: string;
}

const loadCustomersFromStorage = (): Customer[] => {
  try {
    const saved = localStorage.getItem('crm_customers');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load customers from localStorage', e);
  }
  return initialCustomers;
};

const initialState: CustomersState = {
  customers: loadCustomersFromStorage(),
  selectedCustomerId: null,
  drawerOpen: false,
  filterStatus: 'All',
  filterTier: 'All',
  searchQuery: '',
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Omit<Customer, 'id'>>) => {
      const newCustomer: Customer = {
        ...action.payload,
        id: `cust-${Date.now()}`,
      };
      state.customers.unshift(newCustomer);
      localStorage.setItem('crm_customers', JSON.stringify(state.customers));
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
        localStorage.setItem('crm_customers', JSON.stringify(state.customers));
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
      if (state.selectedCustomerId === action.payload) {
        state.selectedCustomerId = null;
        state.drawerOpen = false;
      }
      localStorage.setItem('crm_customers', JSON.stringify(state.customers));
    },
    openCustomerDrawer: (state, action: PayloadAction<string>) => {
      state.selectedCustomerId = action.payload;
      state.drawerOpen = true;
    },
    closeCustomerDrawer: (state) => {
      state.drawerOpen = false;
    },
    setFilterStatus: (state, action: PayloadAction<CustomerStatus | 'All'>) => {
      state.filterStatus = action.payload;
    },
    setFilterTier: (state, action: PayloadAction<CustomerTier | 'All'>) => {
      state.filterTier = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addCustomerTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const customer = state.customers.find((c) => c.id === action.payload.id);
      if (customer && !customer.tags.includes(action.payload.tag)) {
        customer.tags.push(action.payload.tag);
        localStorage.setItem('crm_customers', JSON.stringify(state.customers));
      }
    },
    resetCustomers: (state) => {
      state.customers = initialCustomers;
      localStorage.removeItem('crm_customers');
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  openCustomerDrawer,
  closeCustomerDrawer,
  setFilterStatus,
  setFilterTier,
  setSearchQuery,
  addCustomerTag,
  resetCustomers,
} = customersSlice.actions;

export default customersSlice.reducer;


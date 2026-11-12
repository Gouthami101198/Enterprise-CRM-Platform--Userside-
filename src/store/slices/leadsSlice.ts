import '../storageMigration';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead, LeadStatus } from '../../types/crm';
import { initialLeads } from '../mockData';

interface LeadsState {
  leads: Lead[];
  selectedLeadId: string | null;
  filterStatus: LeadStatus | 'All';
  searchQuery: string;
}

const loadLeadsFromStorage = (): Lead[] => {
  try {
    const saved = localStorage.getItem('crm_leads');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load leads from localStorage', e);
  }
  return initialLeads;
};

const initialState: LeadsState = {
  leads: loadLeadsFromStorage(),
  selectedLeadId: null,
  filterStatus: 'All',
  searchQuery: '',
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead: (state, action: PayloadAction<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newLead: Lead = {
        ...action.payload,
        id: `lead-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      state.leads.unshift(newLead);
      localStorage.setItem('crm_leads', JSON.stringify(state.leads));
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.leads.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('crm_leads', JSON.stringify(state.leads));
      }
    },
    updateLeadStatus: (state, action: PayloadAction<{ id: string; status: LeadStatus }>) => {
      const lead = state.leads.find((l) => l.id === action.payload.id);
      if (lead) {
        lead.status = action.payload.status;
        lead.updatedAt = new Date().toISOString();
        localStorage.setItem('crm_leads', JSON.stringify(state.leads));
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.leads = state.leads.filter((l) => l.id !== action.payload);
      if (state.selectedLeadId === action.payload) {
        state.selectedLeadId = null;
      }
      localStorage.setItem('crm_leads', JSON.stringify(state.leads));
    },
    setSelectedLeadId: (state, action: PayloadAction<string | null>) => {
      state.selectedLeadId = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<LeadStatus | 'All'>) => {
      state.filterStatus = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetLeads: (state) => {
      state.leads = initialLeads;
      localStorage.removeItem('crm_leads');
    },
  },
});

export const {
  addLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  setSelectedLeadId,
  setFilterStatus,
  setSearchQuery,
  resetLeads,
} = leadsSlice.actions;

export default leadsSlice.reducer;


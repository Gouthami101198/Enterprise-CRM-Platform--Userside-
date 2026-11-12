import '../storageMigration';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal, DealStage } from '../../types/crm';
import { initialDeals } from '../mockData';

interface DealsState {
  deals: Deal[];
  selectedDealId: string | null;
  filterStage: DealStage | 'All';
  filterRep: string | 'All';
  searchQuery: string;
}

const loadDealsFromStorage = (): Deal[] => {
  try {
    const saved = localStorage.getItem('crm_deals');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load deals from localStorage', e);
  }
  return initialDeals;
};

const initialState: DealsState = {
  deals: loadDealsFromStorage(),
  selectedDealId: null,
  filterStage: 'All',
  filterRep: 'All',
  searchQuery: '',
};

const getProbabilityForStage = (stage: DealStage): number => {
  switch (stage) {
    case 'Discovery':
      return 25;
    case 'Qualification':
      return 50;
    case 'Proposal':
      return 75;
    case 'Negotiation':
      return 90;
    case 'Closed Won':
      return 100;
    case 'Closed Lost':
      return 0;
    default:
      return 50;
  }
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    addDeal: (state, action: PayloadAction<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newDeal: Deal = {
        ...action.payload,
        id: `deal-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      state.deals.unshift(newDeal);
      localStorage.setItem('crm_deals', JSON.stringify(state.deals));
    },
    updateDeal: (state, action: PayloadAction<Deal>) => {
      const index = state.deals.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.deals[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('crm_deals', JSON.stringify(state.deals));
      }
    },
    updateDealStage: (state, action: PayloadAction<{ id: string; stage: DealStage }>) => {
      const deal = state.deals.find((d) => d.id === action.payload.id);
      if (deal) {
        deal.stage = action.payload.stage;
        deal.probability = getProbabilityForStage(action.payload.stage);
        deal.updatedAt = new Date().toISOString();
        localStorage.setItem('crm_deals', JSON.stringify(state.deals));
      }
    },
    deleteDeal: (state, action: PayloadAction<string>) => {
      state.deals = state.deals.filter((d) => d.id !== action.payload);
      if (state.selectedDealId === action.payload) {
        state.selectedDealId = null;
      }
      localStorage.setItem('crm_deals', JSON.stringify(state.deals));
    },
    setSelectedDealId: (state, action: PayloadAction<string | null>) => {
      state.selectedDealId = action.payload;
    },
    setFilterStage: (state, action: PayloadAction<DealStage | 'All'>) => {
      state.filterStage = action.payload;
    },
    setFilterRep: (state, action: PayloadAction<string | 'All'>) => {
      state.filterRep = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetDeals: (state) => {
      state.deals = initialDeals;
      localStorage.removeItem('crm_deals');
    },
  },
});

export const {
  addDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  setSelectedDealId,
  setFilterStage,
  setFilterRep,
  setSearchQuery,
  resetDeals,
} = dealsSlice.actions;

export default dealsSlice.reducer;


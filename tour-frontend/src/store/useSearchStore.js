import { create } from 'zustand';
import { serviceApi } from '../api/serviceApi';

const useSearchStore = create((set) => ({
  query: '',
  results: [],
  selectedCategory: null,
  isLoading: false,

  search: async (query) => {
    set({ query, isLoading: true });
    try {
      const res = await serviceApi.searchServices(query);
      set({ results: res.data, isLoading: false });
    } catch {
      set({ results: [], isLoading: false });
    }
  },

  setCategory: (category) => set({ selectedCategory: category }),

  clearSearch: () => set({ query: '', results: [], selectedCategory: null }),

  setResults: (results) => set({ results, isLoading: false }),
}));

export default useSearchStore;

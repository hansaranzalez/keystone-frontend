import { defineStore } from 'pinia';

interface ProfileState {
  loading: boolean;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    loading: false
  }),

  getters: {
    isLoading: (state) => state.loading
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    }
  }
});
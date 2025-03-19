// stores/authStore.ts
import { defineStore } from "pinia";


export const useUiStore = defineStore("ui", {
  state: () => ({
    splashVisible: false,
  }),
  actions: {
    setSplashVisible(visible: boolean) {
      this.splashVisible = visible;
    },
  },
  getters: {
    isSplashVisible: (state) => state.splashVisible,
  },
});

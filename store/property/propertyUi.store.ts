import { defineStore } from "pinia";

export enum PropetyFormTabs {
  INFO = "info",
  MULTIMEDIA = "multimedia",
  LOCATION = "location",
  AMENITIES = "amenities",
  FINALIZE = "finalize",
}

interface PropertyUiState {
  currentTab: PropetyFormTabs;
}

export const usePropertyUiStore = defineStore("propertyUi", {
  state: (): PropertyUiState => ({
    currentTab: PropetyFormTabs.INFO,
  }),
  getters: {
    getCurrentTab(state): PropetyFormTabs {
      return state.currentTab;
    },
  },
  actions: {
    setCurrentTab(tab: PropetyFormTabs) {
      this.currentTab = tab;
    },
    resetCurrentTab() {
      this.currentTab = PropetyFormTabs.INFO;
    },
  },
});

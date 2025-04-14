import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import {
  fetchPropertyFeatures,
  fetchPropertyFeature,
  createPropertyFeature,
  updatePropertyFeature,
  deletePropertyFeature,
  fetchFeaturesByPropertyId,
  addFeaturesToProperty,
  removeFeatureFromProperty,
  type PropertyFeature
} from "~/services/property-feature.service";

interface PropertyFeatureState {
  features: PropertyFeature[];
  selectedFeatureId: string | null;
  activeFeature: PropertyFeature | null;
  propertyFeatures: Record<string, PropertyFeature[]>; // Key is propertyId
  loading: boolean;
  error: string | null;
}

export const usePropertyFeatureStore = defineStore("property-features", {
  state: (): PropertyFeatureState => ({
    features: [],
    selectedFeatureId: null,
    activeFeature: null,
    propertyFeatures: {},
    loading: false,
    error: null
  }),

  getters: {
    // Get features by category
    getFeaturesByCategory: (state) => (category: string): PropertyFeature[] => {
      return state.features.filter(feature => feature.category === category);
    },

    // Get highlighted features
    highlightedFeatures(state): PropertyFeature[] {
      return state.features.filter(feature => feature.isHighlighted);
    },

    // Get feature by id
    getFeatureById: (state) => (id: string): PropertyFeature | undefined => {
      return state.features.find(feature => feature.id === id);
    },

    // Get features for a property
    getFeaturesForProperty: (state) => (propertyId: string): PropertyFeature[] => {
      return state.propertyFeatures[propertyId] || [];
    },

    // Get unique categories
    featureCategories(state): string[] {
      const categories = new Set<string>();
      state.features.forEach(feature => {
        if (feature.category) {
          categories.add(feature.category);
        }
      });
      return Array.from(categories);
    }
  },

  actions: {
    // Loading and error management
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    // Feature management
    async loadFeatures(category?: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const features = await fetchPropertyFeatures(category);
        this.features = features;
        return features;
      } catch (error) {
        console.error("Error in loadFeatures:", error);
        this.setError(t('property.features.alerts.fetchError'));
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    async loadFeature(featureId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);
      this.selectedFeatureId = featureId;

      try {
        const feature = await fetchPropertyFeature(featureId);
        
        if (feature) {
          // Update the feature in the features array
          const featureIndex = this.features.findIndex(f => f.id === featureId);
          
          if (featureIndex >= 0) {
            this.features[featureIndex] = feature;
          } else {
            this.features.push(feature);
          }
          
          this.activeFeature = feature;
        } else {
          this.setError(t('property.features.alerts.fetchFeatureError'));
        }
      } catch (error) {
        console.error(`Error in loadFeature(${featureId}):`, error);
        this.setError(t('property.features.alerts.fetchFeatureError'));
      } finally {
        this.setLoading(false);
      }
    },

    async createFeature(featureData: Omit<PropertyFeature, 'id'>) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const feature = await createPropertyFeature(featureData);
        
        if (feature) {
          this.features.push(feature);
          return feature;
        } else {
          this.setError(t('property.features.alerts.createError'));
          return null;
        }
      } catch (error) {
        console.error("Error in createFeature:", error);
        this.setError(t('property.features.alerts.createError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateFeature(featureId: string, featureData: Partial<PropertyFeature>) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const feature = await updatePropertyFeature(featureId, featureData);
        
        if (feature) {
          // Update feature in features array
          const featureIndex = this.features.findIndex(f => f.id === featureId);
          
          if (featureIndex >= 0) {
            this.features[featureIndex] = feature;
          }
          
          // Also update in property features if present
          Object.keys(this.propertyFeatures).forEach(propertyId => {
            const index = this.propertyFeatures[propertyId].findIndex(f => f.id === featureId);
            if (index >= 0) {
              this.propertyFeatures[propertyId][index] = feature;
            }
          });
          
          if (this.selectedFeatureId === featureId) {
            this.activeFeature = feature;
          }
          
          return feature;
        } else {
          this.setError(t('property.features.alerts.updateError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in updateFeature(${featureId}):`, error);
        this.setError(t('property.features.alerts.updateError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteFeature(featureId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const success = await deletePropertyFeature(featureId);
        
        if (success) {
          // Remove feature from features array
          this.features = this.features.filter(f => f.id !== featureId);
          
          // Also remove from property features if present
          Object.keys(this.propertyFeatures).forEach(propertyId => {
            this.propertyFeatures[propertyId] = this.propertyFeatures[propertyId].filter(f => f.id !== featureId);
          });
          
          if (this.selectedFeatureId === featureId) {
            this.selectedFeatureId = null;
            this.activeFeature = null;
          }
          
          return true;
        } else {
          this.setError(t('property.features.alerts.deleteError'));
          return false;
        }
      } catch (error) {
        console.error(`Error in deleteFeature(${featureId}):`, error);
        this.setError(t('property.features.alerts.deleteError'));
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    // Property features management
    async loadFeaturesForProperty(propertyId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const features = await fetchFeaturesByPropertyId(propertyId);
        this.propertyFeatures[propertyId] = features;
        return features;
      } catch (error) {
        console.error(`Error in loadFeaturesForProperty(${propertyId}):`, error);
        this.setError(t('property.features.alerts.fetchPropertyFeaturesError'));
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    async addFeaturesToProperty(propertyId: string, featureIds: string[]) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const features = await addFeaturesToProperty(propertyId, featureIds);
        
        if (features && features.length > 0) {
          this.propertyFeatures[propertyId] = features;
          return features;
        } else {
          this.setError(t('property.features.alerts.addFeaturesError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in addFeaturesToProperty(${propertyId}):`, error);
        this.setError(t('property.features.alerts.addFeaturesError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async removeFeatureFromProperty(propertyId: string, featureId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const features = await removeFeatureFromProperty(propertyId, featureId);
        
        if (features) {
          this.propertyFeatures[propertyId] = features;
          return features;
        } else {
          this.setError(t('property.features.alerts.removeFeatureError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in removeFeatureFromProperty(${propertyId}, ${featureId}):`, error);
        this.setError(t('property.features.alerts.removeFeatureError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    // Reset store state
    $reset() {
      this.features = [];
      this.selectedFeatureId = null;
      this.activeFeature = null;
      this.propertyFeatures = {};
      this.loading = false;
      this.error = null;
    }
  }
});
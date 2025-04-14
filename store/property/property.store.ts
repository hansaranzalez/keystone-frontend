import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import {
  fetchProperties,
  fetchProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  togglePropertyFeatured,
  searchProperties,
  createCompleteProperty,
  updateCompleteProperty,
  deleteCompleteProperty,
  type Property,
  type PropertyFormData,
  type PropertyFilters,
  PropertyStatus
} from "~/services/property/property.service";

interface PropertyState {
  properties: Property[];
  filteredProperties: Property[];
  selectedPropertyId: string | null;
  activeProperty: Property | null;
  filters: PropertyFilters;
  loading: boolean;
  error: string | null;
}

export const usePropertyStore = defineStore("property", {
  state: (): PropertyState => ({
    properties: [],
    filteredProperties: [],
    selectedPropertyId: null,
    activeProperty: null,
    filters: {
      status: null,
      featured: null,
      ownerId: null,
      agentId: null
    },
    loading: false,
    error: null
  }),

  getters: {
    // Get properties by status
    publishedProperties(state): Property[] {
      return state.properties.filter(property => property.status === PropertyStatus.PUBLISHED);
    },

    draftProperties(state): Property[] {
      return state.properties.filter(property => property.status === PropertyStatus.DRAFT);
    },

    rentedProperties(state): Property[] {
      return state.properties.filter(property => property.status === PropertyStatus.RENTED);
    },

    soldProperties(state): Property[] {
      return state.properties.filter(property => property.status === PropertyStatus.SOLD);
    },

    inactiveProperties(state): Property[] {
      return state.properties.filter(property => property.status === PropertyStatus.INACTIVE);
    },

    // Featured properties
    featuredProperties(state): Property[] {
      return state.properties.filter(property => property.featured);
    },

    // Get property by id
    getPropertyById: (state) => (id: string): Property | undefined => {
      return state.properties.find(property => property.id === id);
    },

    // Get selected property
    selectedProperty(state): Property | null {
      if (!state.selectedPropertyId) return null;
      const property = state.properties.find(p => p.id === state.selectedPropertyId);
      return property || null;
    },

    // Count of total properties
    totalPropertyCount(state): number {
      return state.properties.length;
    },

    // Count of properties by status
    publishedPropertyCount(state): number {
      return this.publishedProperties.length;
    },

    draftPropertyCount(state): number {
      return this.draftProperties.length;
    },

    rentedPropertyCount(state): number {
      return this.rentedProperties.length;
    },

    soldPropertyCount(state): number {
      return this.soldProperties.length;
    },

    inactivePropertyCount(state): number {
      return this.inactiveProperties.length;
    },

    // Count of featured properties
    featuredPropertyCount(state): number {
      return this.featuredProperties.length;
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

    // Filter management
    setFilters(filters: Partial<PropertyFilters>) {
      this.filters = { ...this.filters, ...filters };
    },

    clearFilters() {
      this.filters = {
        status: null,
        featured: null,
        ownerId: null,
        agentId: null
      };
    },

    // Property management
    async loadProperties(filters?: PropertyFilters) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        console.log('Property store: Fetching properties with filters', filters || this.filters);
        const properties = await fetchProperties(filters || this.filters);
        console.log('Property store: Properties received', properties);
        
        this.properties = properties;
        this.filteredProperties = properties;
        console.log('Property store: Properties set in store', this.properties);
      } catch (error) {
        console.error("Error in loadProperties:", error);
        this.setError(t('property.alerts.fetchError'));
      } finally {
        this.setLoading(false);
      }
    },

    async loadProperty(propertyId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);
      this.selectedPropertyId = propertyId;

      try {
        const property = await fetchProperty(propertyId);
        
        if (property) {
          // Update the property in the properties array
          const propertyIndex = this.properties.findIndex(p => p.id === propertyId);
          
          if (propertyIndex >= 0) {
            this.properties[propertyIndex] = property;
          } else {
            this.properties.push(property);
          }
          
          this.activeProperty = property;
        } else {
          this.setError(t('property.alerts.fetchPropertyError'));
        }
      } catch (error) {
        console.error(`Error in loadProperty(${propertyId}):`, error);
        this.setError(t('property.alerts.fetchPropertyError'));
      } finally {
        this.setLoading(false);
      }
    },

    async createProperty(propertyData: PropertyFormData) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const property = await createProperty(propertyData);
        
        if (property) {
          this.properties.push(property);
          this.selectedPropertyId = property.id;
          this.activeProperty = property;
          return property;
        } else {
          this.setError(t('property.alerts.createError'));
          return null;
        }
      } catch (error) {
        console.error("Error in createProperty:", error);
        this.setError(t('property.alerts.createError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async createCompleteProperty(propertyData: any) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const property = await createCompleteProperty(propertyData);
        
        if (property) {
          this.properties.push(property);
          this.selectedPropertyId = property.id;
          this.activeProperty = property;
          return property;
        } else {
          this.setError(t('property.alerts.createError'));
          return null;
        }
      } catch (error) {
        console.error("Error in createCompleteProperty:", error);
        this.setError(t('property.alerts.createError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateProperty(propertyId: string, propertyData: Partial<PropertyFormData>) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const property = await updateProperty(propertyId, propertyData);
        
        if (property) {
          // Update property in properties array
          const propertyIndex = this.properties.findIndex(p => p.id === propertyId);
          
          if (propertyIndex >= 0) {
            this.properties[propertyIndex] = property;
          }
          
          if (this.selectedPropertyId === propertyId) {
            this.activeProperty = property;
          }
          
          return property;
        } else {
          this.setError(t('property.alerts.updateError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in updateProperty(${propertyId}):`, error);
        this.setError(t('property.alerts.updateError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateCompleteProperty(propertyId: string, propertyData: any) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const property = await updateCompleteProperty(propertyId, propertyData);
        
        if (property) {
          // Update property in properties array
          const propertyIndex = this.properties.findIndex(p => p.id === propertyId);
          
          if (propertyIndex >= 0) {
            this.properties[propertyIndex] = property;
          }
          
          if (this.selectedPropertyId === propertyId) {
            this.activeProperty = property;
          }
          
          return property;
        } else {
          this.setError(t('property.alerts.updateError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in updateCompleteProperty(${propertyId}):`, error);
        this.setError(t('property.alerts.updateError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteProperty(propertyId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const success = await deleteProperty(propertyId);
        
        if (success) {
          // Remove property from properties array
          this.properties = this.properties.filter(p => p.id !== propertyId);
          
          if (this.selectedPropertyId === propertyId) {
            this.selectedPropertyId = null;
            this.activeProperty = null;
          }
          
          return true;
        } else {
          this.setError(t('property.alerts.deleteError'));
          return false;
        }
      } catch (error) {
        console.error(`Error in deleteProperty(${propertyId}):`, error);
        this.setError(t('property.alerts.deleteError'));
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteCompleteProperty(propertyId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const success = await deleteCompleteProperty(propertyId);
        
        if (success) {
          // Remove property from properties array
          this.properties = this.properties.filter(p => p.id !== propertyId);
          
          if (this.selectedPropertyId === propertyId) {
            this.selectedPropertyId = null;
            this.activeProperty = null;
          }
          
          return true;
        } else {
          this.setError(t('property.alerts.deleteError'));
          return false;
        }
      } catch (error) {
        console.error(`Error in deleteCompleteProperty(${propertyId}):`, error);
        this.setError(t('property.alerts.deleteError'));
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async updateStatus(propertyId: string, status: PropertyStatus) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const property = await updatePropertyStatus(propertyId, status);
        
        if (property) {
          // Update property in properties array
          const propertyIndex = this.properties.findIndex(p => p.id === propertyId);
          
          if (propertyIndex >= 0) {
            this.properties[propertyIndex] = property;
          }
          
          if (this.selectedPropertyId === propertyId) {
            this.activeProperty = property;
          }
          
          return property;
        } else {
          this.setError(t('property.alerts.updateStatusError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in updateStatus(${propertyId}):`, error);
        this.setError(t('property.alerts.updateStatusError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async toggleFeatured(propertyId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const property = await togglePropertyFeatured(propertyId);
        
        if (property) {
          // Update property in properties array
          const propertyIndex = this.properties.findIndex(p => p.id === propertyId);
          
          if (propertyIndex >= 0) {
            this.properties[propertyIndex] = property;
          }
          
          if (this.selectedPropertyId === propertyId) {
            this.activeProperty = property;
          }
          
          return property;
        } else {
          this.setError(t('property.alerts.toggleFeaturedError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in toggleFeatured(${propertyId}):`, error);
        this.setError(t('property.alerts.toggleFeaturedError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async searchProperties(query: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const properties = await searchProperties(query);
        this.filteredProperties = properties;
        return properties;
      } catch (error) {
        console.error(`Error in searchProperties(${query}):`, error);
        this.setError(t('property.alerts.searchError'));
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    // Select property for viewing/editing
    selectProperty(propertyId: string | null) {
      this.selectedPropertyId = propertyId;
      this.activeProperty = propertyId ? this.properties.find(p => p.id === propertyId) || null : null;
    },

    // Clear active property selection
    clearActiveProperty() {
      this.selectedPropertyId = null;
      this.activeProperty = null;
    },

    // Reset store state
    $reset() {
      this.properties = [];
      this.filteredProperties = [];
      this.selectedPropertyId = null;
      this.activeProperty = null;
      this.filters = {
        status: null,
        featured: null,
        ownerId: null,
        agentId: null
      };
      this.loading = false;
      this.error = null;
    }
  }
});
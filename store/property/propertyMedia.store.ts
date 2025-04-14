import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import {
  fetchPropertyMedia,
  fetchPropertyMediaById,
  createPropertyMedia,
  updatePropertyMedia,
  deletePropertyMedia,
  uploadPropertyMedia,
  reorderPropertyMedia,
  setCoverImage,
  type PropertyMedia,
  MediaType
} from "~/services/property-media.service";

interface PropertyMediaState {
  mediaItems: Record<string, PropertyMedia[]>; // Key is propertyId
  selectedMediaId: string | null;
  activeMedia: PropertyMedia | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

export const usePropertyMediaStore = defineStore("property-media", {
  state: (): PropertyMediaState => ({
    mediaItems: {},
    selectedMediaId: null,
    activeMedia: null,
    loading: false,
    error: null,
    uploadProgress: 0
  }),

  getters: {
    // Get media for a property
    getMediaForProperty: (state) => (propertyId: string): PropertyMedia[] => {
      return state.mediaItems[propertyId] || [];
    },

    // Get photos for a property
    getPhotosForProperty: (state) => (propertyId: string): PropertyMedia[] => {
      return (state.mediaItems[propertyId] || []).filter(
        media => media.type === MediaType.PHOTO
      );
    },

    // Get videos for a property
    getVideosForProperty: (state) => (propertyId: string): PropertyMedia[] => {
      return (state.mediaItems[propertyId] || []).filter(
        media => media.type === MediaType.VIDEO
      );
    },

    // Get floor plans for a property
    getFloorPlansForProperty: (state) => (propertyId: string): PropertyMedia[] => {
      return (state.mediaItems[propertyId] || []).filter(
        media => media.type === MediaType.FLOOR_PLAN
      );
    },

    // Get virtual tours for a property
    getVirtualToursForProperty: (state) => (propertyId: string): PropertyMedia[] => {
      return (state.mediaItems[propertyId] || []).filter(
        media => media.type === MediaType.VIRTUAL_TOUR
      );
    },

    // Get cover image for a property
    getCoverImageForProperty: (state) => (propertyId: string): PropertyMedia | undefined => {
      return (state.mediaItems[propertyId] || []).find(
        media => media.type === MediaType.PHOTO && media.isCoverImage
      );
    },

    // Get media by id
    getMediaById: (state) => (id: string): PropertyMedia | undefined => {
      // Search in all property media
      for (const propertyId in state.mediaItems) {
        const media = state.mediaItems[propertyId].find(m => m.id === id);
        if (media) return media;
      }
      return undefined;
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

    setUploadProgress(progress: number) {
      this.uploadProgress = progress;
    },

    // Media management
    async loadMediaForProperty(propertyId: string, type?: MediaType) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const media = await fetchPropertyMedia(propertyId, type);
        this.mediaItems[propertyId] = media;
        return media;
      } catch (error) {
        console.error(`Error in loadMediaForProperty(${propertyId}):`, error);
        this.setError(t('property.media.alerts.fetchError'));
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    async loadMediaById(mediaId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);
      this.selectedMediaId = mediaId;

      try {
        const media = await fetchPropertyMediaById(mediaId);
        
        if (media) {
          // If we already have this property's media loaded, update the item
          if (this.mediaItems[media.property.id]) {
            const mediaIndex = this.mediaItems[media.property.id].findIndex(m => m.id === mediaId);
            
            if (mediaIndex >= 0) {
              this.mediaItems[media.property.id][mediaIndex] = media;
            } else {
              this.mediaItems[media.property.id].push(media);
            }
          } else {
            // If not, create a new array for this property
            this.mediaItems[media.property.id] = [media];
          }
          
          this.activeMedia = media;
        } else {
          this.setError(t('property.media.alerts.fetchMediaError'));
        }
      } catch (error) {
        console.error(`Error in loadMediaById(${mediaId}):`, error);
        this.setError(t('property.media.alerts.fetchMediaError'));
      } finally {
        this.setLoading(false);
      }
    },
    async createMedia(mediaData: Omit<PropertyMedia, 'id'>) {
        const { t } = useI18n();
        this.setLoading(true);
        this.setError(null);
      
        try {
          const media = await createPropertyMedia(mediaData);
          
          if (media) {
            const propertyId = media.property.id;
            
            if (!this.mediaItems[propertyId]) {
              this.mediaItems[propertyId] = [];
            }
            
            this.mediaItems[propertyId].push(media);
            
            // If this is a cover image, update other photos
            if (media.isCoverImage && media.type === MediaType.PHOTO) {
              this.mediaItems[propertyId].forEach(m => {
                if (m.id !== media.id && m.type === MediaType.PHOTO) {
                  m.isCoverImage = false;
                }
              });
            }
            
            return media;
          } else {
            this.setError(t('property.media.alerts.createError'));
            return null;
          }
        } catch (error) {
          console.error("Error in createMedia:", error);
          this.setError(t('property.media.alerts.createError'));
          return null;
        } finally {
          this.setLoading(false);
        }
      },
      
      async updateMedia(mediaId: string, mediaData: Partial<PropertyMedia>) {
        const { t } = useI18n();
        this.setLoading(true);
        this.setError(null);
      
        try {
          const media = await updatePropertyMedia(mediaId, mediaData);
          
          if (media) {
            const propertyId = media.property.id;
            
            if (this.mediaItems[propertyId]) {
              const mediaIndex = this.mediaItems[propertyId].findIndex(m => m.id === mediaId);
              
              if (mediaIndex >= 0) {
                this.mediaItems[propertyId][mediaIndex] = media;
                
                // If this is now a cover image, update other photos
                if (media.isCoverImage && media.type === MediaType.PHOTO) {
                  this.mediaItems[propertyId].forEach((m, idx) => {
                    if (idx !== mediaIndex && m.type === MediaType.PHOTO) {
                      m.isCoverImage = false;
                    }
                  });
                }
              }
            }
            
            if (this.selectedMediaId === mediaId) {
              this.activeMedia = media;
            }
            
            return media;
          } else {
            this.setError(t('property.media.alerts.updateError'));
            return null;
          }
        } catch (error) {
          console.error(`Error in updateMedia(${mediaId}):`, error);
          this.setError(t('property.media.alerts.updateError'));
          return null;
        } finally {
          this.setLoading(false);
        }
      },
      
      async deleteMedia(mediaId: string) {
        const { t } = useI18n();
        this.setLoading(true);
        this.setError(null);
      
        try {
          const success = await deletePropertyMedia(mediaId);
          
          if (success) {
            // Find which property this media belonged to
            let propertyId: string | null = null;
            let wasCoverImage = false;
            let mediaType: MediaType | null = null;
            
            for (const pId in this.mediaItems) {
              const mediaIndex = this.mediaItems[pId].findIndex(m => m.id === mediaId);
              if (mediaIndex >= 0) {
                propertyId = pId;
                wasCoverImage = this.mediaItems[pId][mediaIndex].isCoverImage;
                mediaType = this.mediaItems[pId][mediaIndex].type;
                break;
              }
            }
            
            if (propertyId) {
              // Remove media from the array
              this.mediaItems[propertyId] = this.mediaItems[propertyId].filter(m => m.id !== mediaId);
              
              // If this was a cover image, find a new one
              if (wasCoverImage && mediaType === MediaType.PHOTO && this.mediaItems[propertyId].length > 0) {
                const photos = this.mediaItems[propertyId].filter(m => m.type === MediaType.PHOTO);
                if (photos.length > 0) {
                  photos[0].isCoverImage = true;
                }
              }
            }
            
            if (this.selectedMediaId === mediaId) {
              this.selectedMediaId = null;
              this.activeMedia = null;
            }
            
            return true;
          } else {
            this.setError(t('property.media.alerts.deleteError'));
            return false;
          }
        } catch (error) {
          console.error(`Error in deleteMedia(${mediaId}):`, error);
          this.setError(t('property.media.alerts.deleteError'));
          return false;
        } finally {
          this.setLoading(false);
        }
      },
      
      async uploadMedia(propertyId: string, file: File, type: MediaType, title?: string) {
        const { t } = useI18n();
        this.setLoading(true);
        this.setError(null);
        this.setUploadProgress(0);
      
        try {
          // Create a FormData object
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type);
          if (title) formData.append('title', title);
          
          const media = await uploadPropertyMedia(propertyId, formData, (progress) => {
            this.setUploadProgress(progress);
          });
          
          if (media) {
            if (!this.mediaItems[propertyId]) {
              this.mediaItems[propertyId] = [];
            }
            
            this.mediaItems[propertyId].push(media);
            
            // If this is a cover image, update other photos
            if (media.isCoverImage && media.type === MediaType.PHOTO) {
              this.mediaItems[propertyId].forEach(m => {
                if (m.id !== media.id && m.type === MediaType.PHOTO) {
                  m.isCoverImage = false;
                }
              });
            }
            
            return media;
          } else {
            this.setError(t('property.media.alerts.uploadError'));
            return null;
          }
        } catch (error) {
          console.error(`Error in uploadMedia(${propertyId}):`, error);
          this.setError(t('property.media.alerts.uploadError'));
          return null;
        } finally {
          this.setLoading(false);
          this.setUploadProgress(0);
        }
      },
      
      async reorderMedia(propertyId: string, mediaIds: string[]) {
        const { t } = useI18n();
        this.setLoading(true);
        this.setError(null);
      
        try {
          const media = await reorderPropertyMedia(propertyId, mediaIds);
          
          if (media) {
            this.mediaItems[propertyId] = media;
            return media;
          } else {
            this.setError(t('property.media.alerts.reorderError'));
            return null;
          }
        } catch (error) {
          console.error(`Error in reorderMedia(${propertyId}):`, error);
          this.setError(t('property.media.alerts.reorderError'));
          return null;
        } finally {
          this.setLoading(false);
        }
      },
      
      async setAsCoverImage(propertyId: string, mediaId: string) {
        const { t } = useI18n();
        this.setLoading(true);
        this.setError(null);
      
        try {
          const media = await setCoverImage(propertyId, mediaId);
          
          if (media) {
            // Update all media items for this property
            if (this.mediaItems[propertyId]) {
              this.mediaItems[propertyId].forEach(m => {
                m.isCoverImage = m.id === mediaId;
              });
            }
            
            return media;
          } else {
            this.setError(t('property.media.alerts.setCoverError'));
            return null;
          }
        } catch (error) {
          console.error(`Error in setAsCoverImage(${propertyId}, ${mediaId}):`, error);
          this.setError(t('property.media.alerts.setCoverError'));
          return null;
        } finally {
          this.setLoading(false);
        }
      },
      
      // Clear active media selection
      clearActiveMedia() {
        this.selectedMediaId = null;
        this.activeMedia = null;
      },
      
      // Reset store state
      $reset() {
        this.mediaItems = {};
        this.selectedMediaId = null;
        this.activeMedia = null;
        this.loading = false;
        this.error = null;
        this.uploadProgress = 0;
      }
      }
      });
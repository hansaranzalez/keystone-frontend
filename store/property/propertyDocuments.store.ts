import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import {
  fetchPropertyDocuments,
  fetchPropertyDocumentById,
  createPropertyDocument,
  updatePropertyDocument,
  deletePropertyDocument,
  uploadPropertyDocument,
  type PropertyDocument,
  DocumentType
} from "~/services/property-document.service";

interface PropertyDocumentState {
  documents: Record<string, PropertyDocument[]>; // Key is propertyId
  selectedDocumentId: string | null;
  activeDocument: PropertyDocument | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

export const usePropertyDocumentStore = defineStore("property-document", {
  state: (): PropertyDocumentState => ({
    documents: {},
    selectedDocumentId: null,
    activeDocument: null,
    loading: false,
    error: null,
    uploadProgress: 0
  }),

  getters: {
    // Get documents for a property
    getDocumentsForProperty: (state) => (propertyId: string): PropertyDocument[] => {
      return state.documents[propertyId] || [];
    },

    // Get documents by type for a property
    getDocumentsByType: (state) => (propertyId: string, documentType: DocumentType): PropertyDocument[] => {
      return (state.documents[propertyId] || []).filter(
        doc => doc.document_type === documentType
      );
    },

    // Get document by id
    getDocumentById: (state) => (id: string): PropertyDocument | undefined => {
      // Search in all property documents
      for (const propertyId in state.documents) {
        const document = state.documents[propertyId].find(d => d.id === id);
        if (document) return document;
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

    // Document management
    async loadDocumentsForProperty(propertyId: string, documentType?: DocumentType) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const documents = await fetchPropertyDocuments(propertyId, documentType);
        this.documents[propertyId] = documents;
        return documents;
      } catch (error) {
        console.error(`Error in loadDocumentsForProperty(${propertyId}):`, error);
        this.setError(t('property.documents.alerts.fetchError'));
        return [];
      } finally {
        this.setLoading(false);
      }
    },

    async loadDocumentById(documentId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);
      this.selectedDocumentId = documentId;

      try {
        const document = await fetchPropertyDocumentById(documentId);
        
        if (document) {
          // If we already have this property's documents loaded, update the item
          if (this.documents[document.property.id]) {
            const documentIndex = this.documents[document.property.id].findIndex(d => d.id === documentId);
            
            if (documentIndex >= 0) {
              this.documents[document.property.id][documentIndex] = document;
            } else {
              this.documents[document.property.id].push(document);
            }
          } else {
            // If not, create a new array for this property
            this.documents[document.property.id] = [document];
          }
          
          this.activeDocument = document;
        } else {
          this.setError(t('property.documents.alerts.fetchDocumentError'));
        }
      } catch (error) {
        console.error(`Error in loadDocumentById(${documentId}):`, error);
        this.setError(t('property.documents.alerts.fetchDocumentError'));
      } finally {
        this.setLoading(false);
      }
    },

    async createDocument(documentData: Omit<PropertyDocument, 'id'>) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const document = await createPropertyDocument(documentData);
        
        if (document) {
          const propertyId = document.property.id;
          
          if (!this.documents[propertyId]) {
            this.documents[propertyId] = [];
          }
          
          this.documents[propertyId].push(document);
          return document;
        } else {
          this.setError(t('property.documents.alerts.createError'));
          return null;
        }
      } catch (error) {
        console.error("Error in createDocument:", error);
        this.setError(t('property.documents.alerts.createError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateDocument(documentId: string, documentData: Partial<PropertyDocument>) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const document = await updatePropertyDocument(documentId, documentData);
        
        if (document) {
          const propertyId = document.property.id;
          
          if (this.documents[propertyId]) {
            const documentIndex = this.documents[propertyId].findIndex(d => d.id === documentId);
            
            if (documentIndex >= 0) {
              this.documents[propertyId][documentIndex] = document;
            }
          }
          
          if (this.selectedDocumentId === documentId) {
            this.activeDocument = document;
          }
          
          return document;
        } else {
          this.setError(t('property.documents.alerts.updateError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in updateDocument(${documentId}):`, error);
        this.setError(t('property.documents.alerts.updateError'));
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteDocument(documentId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        const success = await deletePropertyDocument(documentId);
        
        if (success) {
          // Find which property this document belonged to
          let propertyId: string | null = null;
          
          for (const pId in this.documents) {
            const documentIndex = this.documents[pId].findIndex(d => d.id === documentId);
            if (documentIndex >= 0) {
              propertyId = pId;
              break;
            }
          }
          
          if (propertyId) {
            // Remove document from the array
            this.documents[propertyId] = this.documents[propertyId].filter(d => d.id !== documentId);
          }
          
          if (this.selectedDocumentId === documentId) {
            this.selectedDocumentId = null;
            this.activeDocument = null;
          }
          
          return true;
        } else {
          this.setError(t('property.documents.alerts.deleteError'));
          return false;
        }
      } catch (error) {
        console.error(`Error in deleteDocument(${documentId}):`, error);
        this.setError(t('property.documents.alerts.deleteError'));
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async uploadDocument(propertyId: string, file: File, documentType: DocumentType, description?: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);
      this.setUploadProgress(0);

      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', documentType);
        if (description) formData.append('description', description);
        
        const document = await uploadPropertyDocument(propertyId, formData, (progress) => {
          this.setUploadProgress(progress);
        });
        
        if (document) {
          if (!this.documents[propertyId]) {
            this.documents[propertyId] = [];
          }
          
          this.documents[propertyId].push(document);
          return document;
        } else {
          this.setError(t('property.documents.alerts.uploadError'));
          return null;
        }
      } catch (error) {
        console.error(`Error in uploadDocument(${propertyId}):`, error);
        this.setError(t('property.documents.alerts.uploadError'));
        return null;
      } finally {
        this.setLoading(false);
        this.setUploadProgress(0);
      }
    },

    // Clear active document selection
    clearActiveDocument() {
      this.selectedDocumentId = null;
      this.activeDocument = null;
    },

    // Reset store state
    $reset() {
      this.documents = {};
      this.selectedDocumentId = null;
      this.activeDocument = null;
      this.loading = false;
      this.error = null;
      this.uploadProgress = 0;
    }
  }
});
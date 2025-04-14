import { usePropertyStore } from "./property.store";
import { usePropertyDocumentStore } from "./propertyDocuments.store";
import { usePropertyFeatureStore } from "./propertyFeatures.store";
import { usePropertyMediaStore } from "./propertyMedia.store";

export const initializePropertyStores = async () => {
    const propertyStore = usePropertyStore();
    const featureStore = usePropertyFeatureStore();
    
    // Cargar datos básicos que podrían ser necesarios en múltiples partes de la aplicación
    await Promise.all([
      propertyStore.loadProperties(),
      featureStore.loadFeatures()
    ]);
    
    return {
      propertyStore,
      featureStore,
      mediaStore: usePropertyMediaStore(),
      documentStore: usePropertyDocumentStore()
    };
  };
// Property Services Index
// Re-export all property-related services for easier imports

// Main Property Service
export * from './property.service';

// Feature Service
export * from './property-feature.service';

// Media Service
export * from './property-media.service';

// Document Service
export * from './property-document.service';

// Location Service
export * from './property-location.service';

// Initialize property services if needed
export const initPropertyServices = async (): Promise<void> => {
  // Any initialization logic here
  console.log("Property services initialized");
};
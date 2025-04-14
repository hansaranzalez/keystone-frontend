// Property Feature entity interfaces for frontend

export interface PropertyFeature {
    id: string;
    name: string;
    category: string;
    isHighlighted: boolean;
  }
  
  export interface PropertyFeatureFormData {
    name: string;
    category: string;
    isHighlighted?: boolean;
  }
  
  export interface PropertyFeatureApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface FeatureCategory {
    name: string;
    icon: string;
    features: PropertyFeature[];
  }
  
  // Commonly used feature categories
  export const COMMON_FEATURE_CATEGORIES = [
    'Amenities',
    'Interior',
    'Exterior',
    'Security',
    'Utilities',
    'Community',
    'Accessibility',
    'Entertainment',
    'Smart Home',
    'Eco-Friendly'
  ];
  
  // Mapping of categories to icons
  export const FeatureCategoryIcons: Record<string, string> = {
    'Amenities': 'i-heroicons-home-modern',
    'Interior': 'i-heroicons-cube',
    'Exterior': 'i-heroicons-home',
    'Security': 'i-heroicons-shield-check',
    'Utilities': 'i-heroicons-bolt',
    'Community': 'i-heroicons-users',
    'Accessibility': 'i-heroicons-hand-raised',
    'Entertainment': 'i-heroicons-tv',
    'Smart Home': 'i-heroicons-cpu-chip',
    'Eco-Friendly': 'i-heroicons-sparkles',
    'default': 'i-heroicons-star'
  };
// Property entity interfaces for frontend
import type { PropertyLocation } from './property-location.model';
import type { PropertyMedia } from './property-media.model';
import type { PropertyDocument } from './property-document.model';
import type { PropertyFeature } from './property-feature.model';
import type { User } from '~/models/entities/AuthUser';

export enum PropertyType {
  APARTMENT = "apartment",
  HOUSE = "house",
  COMMERCIAL = "commercial",
  LAND = "land",
  OFFICE = "office",
  OTHER = "other",
}

export enum ListingType {
  SALE = "sale",
  RENT = "rent",
}

export enum PropertyStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  RENTED = "rented",
  SOLD = "sold",
  INACTIVE = "inactive",
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  description?: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  constructionYear?: number; // Note camelCase conversion from snake_case
  acquisitionDate?: Date;
  
  // Financial information
  estimatedValue: number;
  price: number;
  listingType: ListingType;
  annualTaxes?: number;
  maintenanceCosts?: number;
  
  // Status
  status: PropertyStatus;
  featured: boolean;
  
  // Relationships
  owner?: User;
  assignedAgent?: User;
  location?: PropertyLocation[];
  media?: PropertyMedia[];
  features?: PropertyFeature[];
  documents?: PropertyDocument[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFormData {
  title: string;
  type: PropertyType;
  description?: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  constructionYear?: number;
  acquisitionDate?: Date;
  estimatedValue: number;
  price: number;
  listingType: ListingType;
  annualTaxes?: number;
  maintenanceCosts?: number;
  status?: PropertyStatus;
  featured?: boolean;
  ownerId?: string;
  assignedAgentId?: string;
}

export interface PropertyFilters {
  status?: PropertyStatus | null;
  featured?: boolean | null;
  ownerId?: string | null;
  agentId?: string | null;
  type?: PropertyType | null;
  listingType?: ListingType | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minBedrooms?: number | null;
  minBathrooms?: number | null;
}

export interface PropertyApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PropertySearchResult {
  id: string;
  title: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status: PropertyStatus;
  featured: boolean;
  mainImage?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
}

export interface PropertyWithRelations extends PropertyFormData {
  locations?: Omit<PropertyLocation, 'propertyId'>[];
  media?: Omit<PropertyMedia, 'propertyId'>[];
  documents?: Omit<PropertyDocument, 'propertyId'>[];
  featureIds?: string[];
}

export type PropertyStatusColors = {
  [key in PropertyStatus]: string;
};

export const PropertyStatusColors: PropertyStatusColors = {
  [PropertyStatus.DRAFT]: 'gray',
  [PropertyStatus.PUBLISHED]: 'green',
  [PropertyStatus.RENTED]: 'purple',
  [PropertyStatus.SOLD]: 'blue',
  [PropertyStatus.INACTIVE]: 'red'
};
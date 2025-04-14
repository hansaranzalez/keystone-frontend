// Property Location entity interfaces for frontend
import type { Property } from './property.model';

export enum ZoneType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  MIXED = 'mixed',
}

export interface PropertyLocation {
  id: string;
  street: string;
  unitNumber?: string; // Note camelCase conversion from snake_case
  city: string;
  state: string;
  zipCode: string; // Note camelCase conversion from snake_case
  country: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  zoneType?: ZoneType;
  additionalDirections?: string;
  property?: Property;
  propertyId: string;
}

export interface PropertyLocationFormData {
  street: string;
  unitNumber?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  zoneType?: ZoneType;
  additionalDirections?: string;
  propertyId: string;
}

export interface PropertyLocationApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}
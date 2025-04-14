// Property Media entity interfaces for frontend
import type { Property } from './property.model';

export enum MediaType {
  PHOTO = "photo",
  VIDEO = "video",
  FLOOR_PLAN = "floor_plan",
  VIRTUAL_TOUR = "virtual_tour",
}

export interface PropertyMedia {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  isCoverImage: boolean;
  displayOrder: number;
  property?: Property;
  propertyId: string;
  createdAt: Date;
}

export interface PropertyMediaFormData {
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  isCoverImage?: boolean;
  displayOrder?: number;
  propertyId: string;
}

export interface PropertyMediaApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface MediaUploadResponse {
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  fileName: string;
  mimeType: string;
}

export type MediaTypeIcons = {
  [key in MediaType]: string;
};

export const MediaTypeIcons: MediaTypeIcons = {
  [MediaType.PHOTO]: 'i-heroicons-photo',
  [MediaType.VIDEO]: 'i-heroicons-video-camera',
  [MediaType.FLOOR_PLAN]: 'i-heroicons-map',
  [MediaType.VIRTUAL_TOUR]: 'i-heroicons-cube-transparent'
};
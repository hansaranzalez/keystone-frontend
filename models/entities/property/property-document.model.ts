// Property Document entity interfaces for frontend
import type { Property } from './property.model';

export enum DocumentType {
  TITLE_DEED = 'title_deed',
  CONTRACT = 'contract',
  CERTIFICATE = 'certificate',
  TAX_DOCUMENT = 'tax_document',
  FLOOR_PLAN = 'floor_plan',
  OTHER = 'other',
}

export interface PropertyDocument {
  id: string;
  fileName: string; // Note camelCase conversion from snake_case
  fileUrl: string; // Note camelCase conversion from snake_case
  documentType: DocumentType; // Note camelCase conversion from document_type
  description?: string;
  fileSize: number; // In bytes
  property?: Property;
  propertyId: string;
  createdAt: Date;
}

export interface PropertyDocumentFormData {
  fileName: string;
  fileUrl: string;
  documentType: DocumentType;
  description?: string;
  fileSize: number;
  propertyId: string;
}

export interface PropertyDocumentApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type DocumentTypeIcons = {
  [key in DocumentType]: string;
};

export type DocumentTypeTitles = {
  [key in DocumentType]: string;
};

export const DocumentTypeIcons: DocumentTypeIcons = {
  [DocumentType.TITLE_DEED]: 'i-heroicons-document-text',
  [DocumentType.CONTRACT]: 'i-heroicons-document-check',
  [DocumentType.CERTIFICATE]: 'i-heroicons-document-duplicate',
  [DocumentType.TAX_DOCUMENT]: 'i-heroicons-receipt-percent',
  [DocumentType.FLOOR_PLAN]: 'i-heroicons-map',
  [DocumentType.OTHER]: 'i-heroicons-document',
};

export const DocumentTypeTitles: DocumentTypeTitles = {
  [DocumentType.TITLE_DEED]: 'Title Deed',
  [DocumentType.CONTRACT]: 'Contract',
  [DocumentType.CERTIFICATE]: 'Certificate',
  [DocumentType.TAX_DOCUMENT]: 'Tax Document',
  [DocumentType.FLOOR_PLAN]: 'Floor Plan',
  [DocumentType.OTHER]: 'Other Document',
};
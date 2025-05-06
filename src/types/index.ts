import { PSM } from 'tesseract.js';

export enum ProcessingStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface RecognizedText {
  text: string;
  confidence: number;
  words?: RecognizedWord[];
  sourceLanguage?: string;
  detectedMedicalTerms?: string[];
  processingTime?: number;
  provider?: 'local' | 'gemini'; // Source of the OCR processing
  medications?: Medication[]; // Extracted medication details
}

export interface RecognizedWord {
  text: string;
  confidence: number;
  boundingBox?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface Medication {
  name: string;
  dosesPerDay: string;
  duration: string;
  totalQuantity: string;
  isConfirmedName?: boolean; // Flag to indicate if the name is confirmed or auto-generated
}

export interface OCROptions {
  languages?: string[];
  preprocess?: boolean;
  medicalTerms?: boolean;
  highlightMedicalTerms?: boolean;
  preferOnline?: boolean; // Whether to prefer online OCR when available
  psm?: PSM; // Tesseract Page Segmentation Mode
}
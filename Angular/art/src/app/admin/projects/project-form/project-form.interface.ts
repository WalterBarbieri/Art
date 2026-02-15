// Interfacce per la preview del form (prima di inviare al backend)
import { PressReview } from '../../../models/press-review.interface';

export interface EventDateSlotForm {
  id?: string;
  date: string;
  isRemoved?: boolean;
}

export interface ProjectFormPreview {
  title: string;
  description: string;
  location: string;
  maxParticipants: number;
  informations: string | null;
  googleMapsLink: string | null;
  contentType: 'COURSE' | 'EVENT';
  contentStatus?: string;
  linkedEventId?: string;
  linkedCourseId?: string;

  // Preview images (URL locali da FileReader)
  coverImagePreview: string | null;
  imagesPreviews: string[];

  // File names per preview
  filesNames: string[];
  videosNames: string[];

  // Gallery items for preview
  galleryItems?: any[];
  filePaths?: string[];

  // Press reviews
  pressReviews?: PressReview[];
}

export interface CourseFormPreview extends ProjectFormPreview {
  contentType: 'COURSE';
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface EventFormPreview extends ProjectFormPreview {
  contentType: 'EVENT';
  eventDates: Date[];
}

// Type union per gestire entrambi
export type ProjectPreview = CourseFormPreview | EventFormPreview;

// Interfaccia per il valore del form (tipizzato)
export interface ProjectFormValue {
  title: string;
  description: string;
  location: string;
  maxParticipants: number;
  informations?: string;
  googleMapsLink?: string;
  dateFrom?: string;
  dateTo?: string;
  eventDates?: EventDateSlotForm[];
  pressReviews?: PressReview[];
}

// Payload per il backend (da costruire in FormData)
export interface CourseFormPayload {
  title: string;
  description: string;
  dateFrom: string; // LocalDate formato ISO
  dateTo: string;
  location: string;
  informations?: string;
  googleMapsLink?: string;
  maxParticipants: number;
  coverImage: File;
  images?: File[];
  files?: File[];
  videos?: File[];
}

export interface EventFormPayload {
  title: string;
  description: string;
  eventDates: string[]; // LocalDateTime formato ISO
  maxParticipants: number;
  location: string;
  informations?: string;
  googleMapsLink?: string;
  coverImage: File;
  images?: File[];
  files?: File[];
  videos?: File[];
}

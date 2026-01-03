import { PressReview } from './press-review.interface';

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImagePath: string;
  imagePaths: string[];
  filePaths: string[];
  videoPaths: string[];
  dateFrom: Date;
  dateTo: Date;
  location: string;
  maxParticipants: number;
  confirmedParticipants: number;
  full: boolean;
  linkedEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
  contentStatus: string;
  relevantDate: Date;
  archived: boolean;
  pressReviews: PressReview[];
}

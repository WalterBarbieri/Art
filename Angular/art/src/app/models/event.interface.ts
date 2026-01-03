import { EventDateSlot } from './event-date-slot.interface';
import { PressReview } from './press-review.interface';

export interface Event {
  id: string;
  title: string;
  description: string;
  coverImagePath: string;
  imagePaths: string[];
  filePaths: string[];
  videoPaths: string[];
  eventDateSlots: EventDateSlot[];
  location: string;
  linkedCourseId: string | null;
  createdAt: Date;
  updatedAt: Date;
  contentStatus: string;
  relevantDate: Date;
  archived: boolean;
  pressReviews: PressReview[];
}

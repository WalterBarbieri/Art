import { EventDateSlot } from "./event-date-slot.interface";

export interface Content {
  id: string;
  title: string;
  description: string;
  contentType: string;
  coverImagePath: string;
  contentStatus: string;
  dateFrom?: Date;
  dateTo?: Date;
  eventDates?: Date[];
  location: string;
}

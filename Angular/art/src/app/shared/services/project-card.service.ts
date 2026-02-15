import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectCardService {

  constructor() { }

  getEventDatesDisplay(eventDates: Date[] | null): { dates: Date[], showDots: boolean } {
    if (!eventDates || eventDates.length === 0) return { dates: [], showDots: false };
    if (eventDates.length <= 2) {
      return { dates: eventDates, showDots: false };
    }
    return { dates: [eventDates[0], eventDates[eventDates.length - 1]], showDots: true };
  }
}

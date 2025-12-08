import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectCardService {

  constructor() { }

  getEventDatesDisplay(eventDates: Date[] | null): { dates: Date[], showDots: boolean } {
    if (!eventDates || eventDates.length === 0) return { dates: [], showDots: false };
    const sorted = [...eventDates].sort((a, b) => b.getDate() - a.getDate());
    if (sorted.length <= 2) {
      return { dates: sorted, showDots: false };
    }
    return { dates: [sorted[0], sorted[sorted.length - 1]], showDots: true };
  }
}

import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EventFormService {
  constructor(private fb: FormBuilder) {}

  /**
   * Add event date to form
   */
  addEventDateToForm(form: FormGroup<any>, initialValue?: any): void {
    const eventDates = form.get('eventDates') as FormArray;
    const slotGroup = this.fb.group({
      id: [initialValue?.id || null],
      date: [initialValue?.date || ''],
      isRemoved: [false]
    });
    eventDates.push(slotGroup);
  }

  /**
   * Remove event date from form (mark as removed for edit mode)
   */
  removeEventDateFromForm(form: FormGroup<any>, index: number): void {
    const eventDates = form.get('eventDates') as FormArray;
    const slotControl = eventDates.at(index);
    if (slotControl.get('id')?.value) {
      // Existing slot: mark as removed
      slotControl.get('isRemoved')?.setValue(true);
    } else {
      // New slot: remove from array
      eventDates.removeAt(index);
    }
  }

  /**
   * Get event dates FormArray
   */
  getEventDates(form: FormGroup<any>): FormArray {
    return form.get('eventDates') as FormArray;
  }

  /**
   * Get event dates values as string array
   */
  getEventDatesValues(form: FormGroup<any>): string[] {
    const eventDates = this.getEventDates(form);
    return eventDates.value.filter((date: string) => date); // Filter out empty dates
  }

  /**
   * Set event dates from existing data
   */
  setEventDates(form: FormGroup<any>, dates: string[]): void {
    const eventDates = this.getEventDates(form);

    // Clear existing dates
    while (eventDates.length > 0) {
      eventDates.removeAt(0);
    }

    // Add new dates
    dates.forEach((date) => {
      eventDates.push(this.fb.control(date, []));
    });

    // Ensure at least one empty date for new entries
    if (dates.length === 0) {
      this.addEventDateToForm(form);
    }
  }
}

import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

/**
 * Custom validator for COURSE date range (dateFrom <= dateTo)
 */
export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control as any; // Cast to access FormGroup methods
  const dateFrom = formGroup.get('dateFrom')?.value;
  const dateTo = formGroup.get('dateTo')?.value;

  if (dateFrom && dateTo) {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (fromDate > toDate) {
      return { dateRangeInvalid: true };
    }
  }

  return null;
}

/**
 * Custom validator for EVENT duplicate dates
 */
export function duplicateDatesValidator(control: AbstractControl): ValidationErrors | null {
  const formArray = control as FormArray;
  if (!formArray || !formArray.value) return null;

  const dates = formArray.value.filter((date: string) => date); // Filter out empty dates
  const uniqueDates = new Set(dates);

  if (uniqueDates.size !== dates.length) {
    return { duplicateDates: true };
  }

  return null;
}

/**
 * Validator for Google Maps embed URL
 */
export function googleMapsLinkValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || value.trim() === '') {
    return null; // Optional field
  }

  let url = value.trim();

  // If input is full iframe, extract src
  const iframeMatch = value.match(/<iframe[^>]*src="([^"]*)"/i);
  if (iframeMatch) {
    url = iframeMatch[1];
  }

  // Validate URL format
  const googleMapsRegex = /^https:\/\/www\.google\.com\/maps\/embed\?pb=/;
  if (!googleMapsRegex.test(url)) {
    return { invalidGoogleMapsUrl: true };
  }

  return null;
}

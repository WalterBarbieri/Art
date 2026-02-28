import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ProjectPreview,
  ProjectFormValue,
  ProjectFormPreview,
  CourseFormPreview,
  EventFormPreview,
  EventDateSlotForm,
  PressReviewForm,
} from '../projects/project-form/project-form.interface';
import {
  dateRangeValidator,
  duplicateDatesValidator,
  googleMapsLinkValidator,
  atLeastOneActiveDateValidator,
} from '../projects/project-form/project-form.validators';
import { AdminUtilsService } from '../utils/admin-utils.service';
import { EventFormService } from './event-form.service';

export interface FormFiles {
  coverImage: File | null;
  images: File[];
  files: File[];
  videos: File[];
}

export interface RemovedFiles {
  removedImages: string[];
  removedFiles: string[];
  removedVideos: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectFormService {
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private eventFormService: EventFormService,
  ) {}

  /**
   * Create form based on project type
   */
  createForm(projectType: 'COURSE' | 'EVENT'): FormGroup<any> {
    const form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      maxParticipants: [1, [Validators.required, Validators.min(1)]],
      informations: [''],
      googleMapsLink: ['', [googleMapsLinkValidator]],
    }) as FormGroup<any>;

    // Add type-specific fields
    if (projectType === 'COURSE') {
      form.addControl('dateFrom', this.fb.control('', [Validators.required]));
      form.addControl('dateTo', this.fb.control('', [Validators.required]));
      form.setValidators(dateRangeValidator);
    } else {
      form.addControl(
        'eventDates',
        this.fb.array(
          [],
          [
            Validators.required,
            duplicateDatesValidator,
            atLeastOneActiveDateValidator,
          ],
        ),
      );
    }

    return form;
  }

  /**
   * Create preview object from form value and files
   */
  createPreview(
    formValue: ProjectFormValue,
    files: FormFiles,
    project?: any,
  ): ProjectPreview {
    let sanitizedGoogleMapsLink: string | null = null;
    try {
      sanitizedGoogleMapsLink = AdminUtilsService.sanitizeGoogleMapsUrl(
        formValue.googleMapsLink || '',
      );
    } catch {
      // If invalid, keep null
    }

    const pressReviews = formValue.pressReviews || [];

    const basePreview: Omit<
      ProjectFormPreview,
      'contentType' | 'dateFrom' | 'dateTo' | 'eventDates'
    > = {
      title:
        formValue.title ||
        this.translate.instant('ADMIN.PROJECTS.FORM.DEFAULT_TITLE'),
      description:
        formValue.description ||
        this.translate.instant('ADMIN.PROJECTS.FORM.DEFAULT_DESCRIPTION'),
      location:
        formValue.location ||
        this.translate.instant('ADMIN.PROJECTS.FORM.DEFAULT_LOCATION'),
      maxParticipants: formValue.maxParticipants || 1,
      informations: formValue.informations || null,
      googleMapsLink: sanitizedGoogleMapsLink,
      contentStatus: project?.contentStatus || 'UPCOMING',
      linkedEventId: project?.linkedEventId,
      linkedCourseId: project?.linkedCourseId,
      coverImagePreview: null, // Will be set from component state
      imagesPreviews: [], // Will be set from component state
      filesNames: files.files.map((f) => f.name),
      videosNames: files.videos.map((f) => f.name),
    };

    if (this.isCourseForm(formValue)) {
      return {
        ...basePreview,
        contentType: 'COURSE' as const,
        dateFrom: formValue.dateFrom ? new Date(formValue.dateFrom) : null,
        dateTo: formValue.dateTo ? new Date(formValue.dateTo) : null,
        pressReviews: pressReviews,
      } as CourseFormPreview;
    } else {
      return {
        ...basePreview,
        contentType: 'EVENT' as const,
        eventDates:
          formValue.eventDates
            ?.filter(
              (d: any) =>
                d.date && !d.isRemoved && !isNaN(new Date(d.date).getTime()),
            )
            .map((d: any) => new Date(d.date)) || [],
        pressReviews: pressReviews,
      } as EventFormPreview;
    }
  }

  /**
   * Build FormData for API submission
   */
  buildFormData(
    formValue: ProjectFormValue,
    files: FormFiles,
    removedFiles?: RemovedFiles,
  ): FormData {
    const formData = new FormData();

    // Common fields
    formData.append('title', formValue.title);
    formData.append(
      'description',
      AdminUtilsService.sanitizeHtml(formValue.description),
    );
    formData.append('location', formValue.location);
    formData.append('maxParticipants', formValue.maxParticipants.toString());

    if (formValue.informations) {
      formData.append(
        'informations',
        AdminUtilsService.sanitizeHtml(formValue.informations),
      );
    }
    if (formValue.googleMapsLink) {
      const sanitizedLink = AdminUtilsService.sanitizeGoogleMapsUrl(
        formValue.googleMapsLink,
      );
      formData.append('googleMapsLink', sanitizedLink);
    }

    // Type-specific fields
    if (this.isCourseForm(formValue)) {
      formData.append('dateFrom', formValue.dateFrom!);
      formData.append('dateTo', formValue.dateTo!);
    } else {
      // EVENT: map eventDates to backend DTO fields using indexed form data
      let eventSlotIndex = 0;
      let removedIndex = 0;
      let newIndex = 0;

      formValue.eventDates?.forEach((slot: any) => {
        if (slot.id && !slot.isRemoved) {
          formData.append(`eventDateSlots[${eventSlotIndex}].id`, slot.id);
          formData.append(`eventDateSlots[${eventSlotIndex}].date`, slot.date);
          eventSlotIndex++;
        } else if (slot.id && slot.isRemoved) {
          formData.append(`removedEventDateSlotIds[${removedIndex}]`, slot.id);
          removedIndex++;
        } else if (slot.date) {
          formData.append(`newEventDateSlots[${newIndex}]`, slot.date);
          newIndex++;
        }
      });
    }

    // Press Reviews
    let updatedIndex = 0;
    let removedIndex = 0;
    let newIndex = 0;

    formValue.pressReviews?.forEach((review: any) => {
      // Solo press review proprie possono essere modificate
      if (!review.own) return;

      if (review.id && !review.isRemoved) {
        // Verifica che abbia un imagePath valido (non cancellato)
        if (review.imagePath && review.imagePath.startsWith('http')) {
          formData.append(`updatedPressReviews[${updatedIndex}].id`, review.id);
          formData.append(`updatedPressReviews[${updatedIndex}].url`, review.url);
          if (review.imageFile) formData.append(`updatedPressReviews[${updatedIndex}].image`, review.imageFile);
          updatedIndex++;
        }
      } else if (review.id && review.isRemoved) {
        formData.append(`removedPressReviewIds[${removedIndex}]`, review.id);
        removedIndex++;
      } else if (review.url) {  // Nuova
        formData.append(`newPressReviews[${newIndex}].url`, review.url);
        if (review.imageFile) formData.append(`newPressReviews[${newIndex}].image`, review.imageFile);
        newIndex++;
      }
    });

    // Removed files (for edit mode)
    if (removedFiles) {
      removedFiles.removedImages.forEach((path) => {
        formData.append('removedImages', path);
      });
      removedFiles.removedFiles.forEach((path) => {
        formData.append('removedFiles', path);
      });
      removedFiles.removedVideos.forEach((path) => {
        formData.append('removedVideos', path);
      });
    }

    // Files
    if (files.coverImage) {
      formData.append('coverImage', files.coverImage);
    }

    files.images.forEach((file) => {
      formData.append('images', file);
    });

    files.files.forEach((file) => {
      formData.append('files', file);
    });

    files.videos.forEach((file) => {
      formData.append('videos', file);
    });

    // Log FormData contents for debugging
    console.log('FormData being sent:');
    try {
      for (let [key, value] of (formData as any).entries()) {
        console.log(`${key}:`, value);
      }
    } catch (e) {
      console.log(
        'FormData entries not supported, keys:',
        Array.from((formData as any).keys()),
      );
    }

    return formData;
  }

  /**
   * Populate form with existing project data
   */
  populateForm(
    form: FormGroup,
    project: any,
    projectType: 'COURSE' | 'EVENT',
  ): void {
    let sanitizedGoogleMapsLink = '';
    try {
      sanitizedGoogleMapsLink = AdminUtilsService.sanitizeGoogleMapsUrl(
        project.googleMapsLink || '',
      );
    } catch {
      // If invalid, keep empty
    }

    form.patchValue({
      title: project.title,
      description: project.description,
      location: project.location,
      maxParticipants:
        projectType === 'COURSE'
          ? project.maxParticipants
          : Math.min(
              ...project.eventDateSlots.map((s: any) => s.maxParticipants),
            ),
      informations: project.informations || '',
      googleMapsLink: sanitizedGoogleMapsLink,
    });

    if (projectType === 'COURSE') {
      form.patchValue({
        dateFrom: project.dateFrom,
        dateTo: project.dateTo,
      });
    } else {
      // Clear existing event dates
      const eventDatesArray = form.get('eventDates') as FormArray;
      eventDatesArray.clear();
      // Add existing dates from eventDateSlots
      if (project.eventDateSlots && project.eventDateSlots.length > 0) {
        project.eventDateSlots.forEach((dateSlot: any) => {
          const slotGroup = this.fb.group({
            id: [dateSlot.id],
            date: [dateSlot.date.slice(0, 16)],
            isRemoved: [false],
          });
          eventDatesArray.push(slotGroup);
        });
      } else {
        // Add at least one empty date for new events
        const emptySlot = this.fb.group({
          id: [null],
          date: [''],
          isRemoved: [false],
        });
        eventDatesArray.push(emptySlot);
      }
    }
  }

  /**
   * Check if form value is for COURSE
   */
  private isCourseForm(
    formValue: ProjectFormValue,
  ): formValue is ProjectFormValue & { dateFrom: string; dateTo: string } {
    return 'dateFrom' in formValue && 'dateTo' in formValue;
  }

  // Create an empty event date slot FormGroup
  createEmptyEventDateSlot(): FormGroup {
    return this.fb.group({
      id: [null],
      date: [''],
      isRemoved: [false],
    });
  }

  /**
   * Populate press reviews for edit mode
   */
  populatePressReviews(project: any): PressReviewForm[] {
    if (!project.pressReviews || project.pressReviews.length === 0) {
      return [];
    }

    return project.pressReviews.map((review: any) => ({
      ...review,
      isRemoved: false,
      imageFile: undefined, // No file initially
    }));
  }
}

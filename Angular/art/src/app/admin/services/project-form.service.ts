import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProjectPreview, ProjectFormValue } from '../projects/project-form/project-form.interface';
import { dateRangeValidator, duplicateDatesValidator } from '../projects/project-form/project-form.validators';
import { AdminUtilsService } from '../utils/admin-utils.service';
import { EventFormService } from './event-form.service';

export interface FormFiles {
  coverImage: File | null;
  images: File[];
  files: File[];
  videos: File[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectFormService {

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private eventFormService: EventFormService
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
      googleMapsLink: ['']
    }) as FormGroup<any>;

    // Add type-specific fields
    if (projectType === 'COURSE') {
      form.addControl('dateFrom', this.fb.control('', [Validators.required]));
      form.addControl('dateTo', this.fb.control('', [Validators.required]));
      form.setValidators(dateRangeValidator);
    } else {
      form.addControl('eventDates', this.fb.array([], [Validators.required, duplicateDatesValidator]));
      this.eventFormService.addEventDateToForm(form); // Add at least one initial date
    }

    return form;
  }

  /**
   * Create preview object from form value and files
   */
  createPreview(formValue: ProjectFormValue, files: FormFiles): ProjectPreview {
    const basePreview = {
      title: formValue.title || this.translate.instant('ADMIN.PROJECTS.FORM.DEFAULT_TITLE'),
      description: formValue.description || this.translate.instant('ADMIN.PROJECTS.FORM.DEFAULT_DESCRIPTION'),
      location: formValue.location || this.translate.instant('ADMIN.PROJECTS.FORM.DEFAULT_LOCATION'),
      maxParticipants: formValue.maxParticipants || 1,
      informations: formValue.informations || null,
      googleMapsLink: formValue.googleMapsLink || null,
      coverImagePreview: null, // Will be set from component state
      imagesPreviews: [], // Will be set from component state
      filesNames: files.files.map(f => f.name),
      videosNames: files.videos.map(f => f.name)
    };

    if (this.isCourseForm(formValue)) {
      return {
        ...basePreview,
        contentType: 'COURSE',
        dateFrom: formValue.dateFrom ? new Date(formValue.dateFrom) : null,
        dateTo: formValue.dateTo ? new Date(formValue.dateTo) : null
      };
    } else {
      return {
        ...basePreview,
        contentType: 'EVENT',
        eventDates: formValue.eventDates?.filter(d => d && !isNaN(new Date(d).getTime())).map((d) => new Date(d)) || []
      };
    }
  }

  /**
   * Build FormData for API submission
   */
  buildFormData(formValue: ProjectFormValue, files: FormFiles): FormData {
    const formData = new FormData();

    // Common fields
    formData.append('title', formValue.title);
    formData.append('description', AdminUtilsService.sanitizeHtml(formValue.description));
    formData.append('location', formValue.location);
    formData.append('maxParticipants', formValue.maxParticipants.toString());

    if (formValue.informations) {
      formData.append('informations', AdminUtilsService.sanitizeHtml(formValue.informations));
    }
    if (formValue.googleMapsLink) {
      formData.append('googleMapsLink', formValue.googleMapsLink);
    }

    // Type-specific fields
    if (this.isCourseForm(formValue)) {
      formData.append('dateFrom', formValue.dateFrom!);
      formData.append('dateTo', formValue.dateTo!);
    } else {
      // EVENT: array of dates
      formValue.eventDates?.forEach((date) => {
        formData.append('eventDates', date);
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

    return formData;
  }

   /**
   * Check if form value is for COURSE
   */
  private isCourseForm(formValue: ProjectFormValue): formValue is ProjectFormValue & { dateFrom: string; dateTo: string } {
    return 'dateFrom' in formValue && 'dateTo' in formValue;
  }

  /**
   * Populate form with existing project data
   */
  populateForm(form: FormGroup, project: any, projectType: 'COURSE' | 'EVENT'): void {
    form.patchValue({
      title: project.title,
      description: project.description,
      location: project.location,
      maxParticipants: project.maxParticipants,
      informations: project.informations || '',
      googleMapsLink: project.googleMapsLink || ''
    });

    if (projectType === 'COURSE') {
      form.patchValue({
        dateFrom: project.dateFrom,
        dateTo: project.dateTo
      });
    } else {
      // Clear existing event dates
      const eventDatesArray = form.get('eventDates') as FormArray;
      while (eventDatesArray.length) {
        eventDatesArray.removeAt(0);
      }
      // Add existing dates
      project.eventDates?.forEach((dateSlot: any) => {
        this.eventFormService.addEventDateToForm(form, dateSlot);
      });
    }
  }
}

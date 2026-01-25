import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AdminCourseService } from './admin-course.service';
import { AdminEventService } from './admin-event.service';
import { FormFiles, ProjectFormService } from './project-form.service';
import { ProjectFormValue } from '../projects/project-form/project-form.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectSubmitService {

  constructor(
    private adminCourseService: AdminCourseService,
    private adminEventService: AdminEventService,
    private formService: ProjectFormService,
  ) {}

  submit(
    projectType: 'COURSE' | 'EVENT',
    formValue: ProjectFormValue,
    files: FormFiles,
    isEdit: boolean,
    projectId?: string
  ): Observable<any> {
    const formData = this.formService.buildFormData(formValue, files);

    if (projectType === 'COURSE') {
      if (isEdit && projectId) {
        // TODO: Implement update when available
        return throwError(() => new Error('Edit not implemented yet'));
      } else {
        return this.adminCourseService.create(formData);
      }
    } else {
      if (isEdit && projectId) {
        // TODO: Implement update when available
        return throwError(() => new Error('Edit not implemented yet'));
      } else {
        return this.adminEventService.create(formData);
      }
    }
  }
}

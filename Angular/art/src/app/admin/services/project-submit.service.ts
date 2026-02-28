import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AdminCourseService } from './admin-course.service';
import { AdminEventService } from './admin-event.service';
import { FormFiles, ProjectFormService, RemovedFiles } from './project-form.service';
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
    projectId?: string,
    removedFiles?: RemovedFiles
  ): Observable<any> {
    console.log('ProjectSubmitService.submit called with:', {
      projectType,
      isEdit,
      projectId,
      formValue,
      files,
      removedFiles
    });

    const formData = this.formService.buildFormData(formValue, files, removedFiles);

    if (projectType === 'COURSE') {
      if (isEdit && projectId) {
        console.log('Calling adminCourseService.update with id:', projectId);
        return this.adminCourseService.update(projectId, formData);
      } else {
        return this.adminCourseService.create(formData);
      }
    } else {
      if (isEdit && projectId) {
        console.log('Calling adminEventService.update with id:', projectId);
        return this.adminEventService.update(projectId, formData);
      } else {
        return this.adminEventService.create(formData);
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectPreview } from '../projects/project-form/project-form.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectPreviewService {
  private previewSubject = new BehaviorSubject<ProjectPreview | null>(null);
  public preview$: Observable<ProjectPreview | null> = this.previewSubject.asObservable();

  setPreview(preview: ProjectPreview | null): void {
    this.previewSubject.next(preview);
  }

  getCurrentPreview(): ProjectPreview | null {
    return this.previewSubject.value;
  }

  updatePreview(updates: Partial<ProjectPreview>): void {
    const current = this.previewSubject.value;
    if (current) {
      this.previewSubject.next({ ...current, ...updates } as ProjectPreview);
    }
  }
}

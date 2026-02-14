import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectEvent } from 'src/app/models/event.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private baseUrl = `${environment.baseURL}api/event`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<ProjectEvent> {
    return this.http.post<ProjectEvent>(this.baseUrl, formData);
  }

  update(id: string, formData: FormData): Observable<ProjectEvent> {
    return this.http.put<ProjectEvent>(`${this.baseUrl}/${id}`, formData);
  }

  getById(id: string): Observable<ProjectEvent> {
    return this.http.get<ProjectEvent>(`${this.baseUrl}/${id}`);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from 'src/app/models/course.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCourseService {
  private baseUrl = `${environment.baseURL}api/course`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, formData);
  }

  update(id: string, formData: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, formData);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../models/course.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}api/course/${id}`);
  }
}

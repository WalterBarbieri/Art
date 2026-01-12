import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from 'src/app/models/event.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private baseUrl = `${environment.baseURL}api/event`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, formData);
  }

}

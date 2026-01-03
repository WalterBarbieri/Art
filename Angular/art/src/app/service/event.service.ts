import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}api/event/${id}`);
  }

}

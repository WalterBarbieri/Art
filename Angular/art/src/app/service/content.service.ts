import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Content } from '../models/content.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAllActiveSorted(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.baseUrl}content/all/sorted`);
  }

  getTopActiveSorted(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.baseUrl}content/homepage`);
  }

}

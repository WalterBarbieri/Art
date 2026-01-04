import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Content } from '../models/content.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  baseUrl = environment.baseURL;
  fallbackImage: string = '';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.baseUrl}content/all`);
  }

  getAllSorted(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.baseUrl}content/all/sorted`);
  }

  getTopSorted(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.baseUrl}content/homepage`);
  }

}

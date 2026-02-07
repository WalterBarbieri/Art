import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Content } from 'src/app/models/content.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminContentService {
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAllSorted(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.baseUrl}content/all`);
  }

  patchArchive(id: string, contentType: string): Observable<Content> {
    const endpoint = contentType === 'Course' ? 'course' : 'event';
    return this.http.patch<Content>(`${this.baseUrl}api/${endpoint}/${id}/archive`, {});
  }
}

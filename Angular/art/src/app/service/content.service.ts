import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Content } from '../models/content.interface';
import { StaticAssetService } from './static-asset.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  baseUrl = environment.baseURL;
  fallbackImage: string = '';
  constructor(private http: HttpClient, private staticAssetsService: StaticAssetService) { }

  getAll(): Observable<Content[]> {
    if (environment.isStaticMode) {
      return of(this.getMockContents());
    }
    return this.http.get<Content[]>(`${this.baseUrl}content/all`);
  }

  getAllSorted(): Observable<Content[]> {
    if (environment.isStaticMode) {
      return of(this.getMockContents().sort((a, b) => new Date(b.dateFrom || 0).getTime() - new Date(a.dateFrom || 0).getTime()));
    }
    return this.http.get<Content[]>(`${this.baseUrl}content/all/sorted`);
  }

  getTopSorted(): Observable<Content[]> {
    if (environment.isStaticMode) {
      return of(this.getMockContents().slice(0, 6)); // Top 6 for homepage
    }
    return this.http.get<Content[]>(`${this.baseUrl}content/homepage`);
  }

  private loadStaticAssets(): void {
    this.fallbackImage = this.staticAssetsService.getAssetPath('fallback_image');
  }

  private getMockContents(): Content[] {
    return [
      {
        id: '1',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Event',
        coverImagePath: this.fallbackImage,
        contentStatus: 'UPCOMING',
        dateFrom: null,
        dateTo: null,
        eventDates: [new Date('2026-01-15')],
        location: 'Luogo da definire'
      },
      {
        id: '2',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Course',
        coverImagePath: this.fallbackImage,
        contentStatus: 'UPCOMING',
        dateFrom: new Date('2026-02-01'),
        dateTo: new Date('2026-02-03'),
        eventDates: null,
        location: 'Luogo da definire'
      },
      {
        id: '3',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Event',
        coverImagePath: this.fallbackImage,
        contentStatus: 'ONGOING',
        dateFrom: null,
        dateTo: null,
        eventDates: [new Date('2025-12-14'), new Date('2025-12-21')],
        location: 'Luogo da definire'
      },
      {
        id: '4',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Course',
        coverImagePath: this.fallbackImage,
        contentStatus: 'ONGOING',
        dateFrom: new Date('2025-12-10'),
        dateTo: new Date('2026-02-10'),
        eventDates: null,
        location: 'Luogo da definire'
      },
      {
        id: '5',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Event',
        coverImagePath: this.fallbackImage,
        contentStatus: 'COMPLETED',
        dateFrom: null,
        dateTo: null,
        eventDates: [new Date('2025-05-05')],
        location: 'Luogo da definire'
      },
      {
        id: '6',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Course',
        coverImagePath: this.fallbackImage,
        contentStatus: 'COMPLETED',
        dateFrom: new Date('2025-06-15'),
        dateTo: new Date('2025-06-17'),
        eventDates: null,
        location: 'Luogo da definire'
      },
      {
        id: '7',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Event',
        coverImagePath: this.fallbackImage,
        contentStatus: 'COMPLETED',
        dateFrom: null,
        dateTo: null,
        eventDates: [new Date('2025-07-25')],
        location: 'Luogo da definire'
      },
      {
        id: '8',
        title: 'Progetto in Arrivo',
        description: 'I progetti sono in arrivo!',
        contentType: 'Course',
        coverImagePath: this.fallbackImage,
        contentStatus: 'COMPLETED',
        dateFrom: new Date('2025-08-01'),
        dateTo: new Date('2025-08-03'),
        eventDates: null,
        location: 'Luogo da definire'
      }
    ];
  }
}

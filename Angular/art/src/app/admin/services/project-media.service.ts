import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ImageService } from 'src/app/service/image.service';

export interface ExistingMedia {
  coverImage: string | null;
  images: string[];
  videos: { name: string; url: string }[];
  files: { name: string }[];
  pressReviews: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectMediaService {
  constructor(private imageService: ImageService) {}

  loadExistingMedia(project: any): Observable<ExistingMedia> {
    const media: ExistingMedia = {
      coverImage: null,
      images: [],
      videos: [],
      files: [],
      pressReviews: [],
    };

    const observables: Observable<any>[] = [];

    // Cover image
    if (project.coverImagePath) {
      observables.push(
        this.imageService
          .getFullImageUrl(project.coverImagePath)
          .pipe(map((url) => (media.coverImage = url))),
      );
    }

    // Images
    if (project.imagePaths && project.imagePaths.length > 0) {
      project.imagePaths.forEach((path: string) => {
        observables.push(
          this.imageService
            .getFullImageUrl(path)
            .pipe(map((url) => media.images.push(url))),
        );
      });
    }

    // Videos
    if (project.videoPaths && project.videoPaths.length > 0) {
      project.videoPaths.forEach((path: string) => {
        observables.push(
          this.imageService
            .getFullVideoUrl(path)
            .pipe(
              map((url) => {
                const fullName = path.split('/').pop() || '';
                const parsedName = fullName.substring(14); // Remove timestamp prefix
                media.videos.push({
                  name: parsedName,
                  url,
                });
              }),
            ),
        );
      });
    }

    // Files (no URL needed, just names)
    if (project.filePaths && project.filePaths.length > 0) {
      project.filePaths.forEach((path: string) => {
        const fullName = path.split('/').pop() || '';
        const parsedName = fullName.substring(14); // Remove timestamp prefix
        media.files.push({ name: parsedName });
      });
    }

    // Press reviews
    if (project.pressReviews && project.pressReviews.length > 0) {
      project.pressReviews.forEach((review: any, index: number) => {
        observables.push(
          this.imageService
            .getFullImageUrl(review.imagePath)
            .pipe(
              map((url) => {
                project.pressReviews[index].imagePath = url;
              }),
            ),
        );
      });
      media.pressReviews = project.pressReviews;
    }

    if (observables.length > 0) {
      return forkJoin(observables).pipe(map(() => media));
    } else {
      return new Observable((subscriber) => {
        subscriber.next(media);
        subscriber.complete();
      });
    }
  }
}

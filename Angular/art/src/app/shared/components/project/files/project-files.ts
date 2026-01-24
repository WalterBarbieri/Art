import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-files',
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-files.html',
  styleUrls: ['./project-files.scss']
})
export class ProjectFilesComponent {
  @Input() filePaths: string[] = [];
  @Input() isPreviewMode: boolean = false;
  @Output() fileClick = new EventEmitter<{file: string, fileName: string}>();

  onFileClick(file: string): void {
    if (!this.isPreviewMode) {
      this.fileClick.emit({ file, fileName: this.getFileName(file) });
    }
  }

  getFileName(filePath: string): string {
    if (filePath.startsWith('http')) {
    const fileName = filePath.split('/').pop() || '';
    return fileName.substring(14);
    }
    return filePath;
  }

  getFileIconClass(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fa fa-file-pdf-o';
      case 'doc':
      case 'docx':
        return 'fa fa-file-word-o';
      case 'xls':
      case 'xlsx':
        return 'fa fa-file-excel-o';
      case 'ppt':
      case 'pptx':
        return 'fa fa-file-powerpoint-o';
      case 'zip':
      case 'rar':
        return 'fa fa-file-archive-o';
      case 'txt':
        return 'fa fa-file-text-o';
      default:
        return 'fa fa-file-o';
    }
  }
}

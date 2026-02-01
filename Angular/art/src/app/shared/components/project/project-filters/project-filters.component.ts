import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../../services/storage.service';

export interface FilterValues {
  status: string;
  type: string;
  sortOrder: string;
  archived?: string;
}

@Component({
  selector: 'app-project-filters',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './project-filters.component.html',
  styleUrl: './project-filters.component.scss',
})
export class ProjectFiltersComponent implements OnInit {
  @Input() showArchiveFilter: boolean = false;
  @Output() filtersChanged = new EventEmitter<FilterValues>();

  showFilters: boolean = false;
  selectedStatusFilter: string = 'all';
  selectedTypeFilter: string = 'all';
  selectedSortOrder: string = 'default';
  selectedArchiveFilter: string = 'all';

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadSavedFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.selectedStatusFilter = 'all';
    this.selectedTypeFilter = 'all';
    this.selectedSortOrder = 'default';
    this.selectedArchiveFilter = 'all';
    this.onFilterChange();
  }

  onFilterChange(): void {
    const filters: FilterValues = {
      status: this.selectedStatusFilter,
      type: this.selectedTypeFilter,
      sortOrder: this.selectedSortOrder,
    };

    if (this.showArchiveFilter) {
      filters.archived = this.selectedArchiveFilter;
    }

    this.storageService.setProjectFilters(filters, this.showArchiveFilter);
    this.filtersChanged.emit(filters);
  }

  private loadSavedFilters(): void {
    const savedFilters = this.storageService.getProjectFilters(
      this.showArchiveFilter,
    );
    if (savedFilters) {
      this.selectedStatusFilter = savedFilters.status || 'all';
      this.selectedTypeFilter = savedFilters.type || 'all';
      this.selectedSortOrder = savedFilters.sortOrder || 'default';
      if (this.showArchiveFilter && savedFilters.archived) {
        this.selectedArchiveFilter = savedFilters.archived;
      }
      // Emit initial filters if they exist
      this.onFilterChange();
    }
  }
}

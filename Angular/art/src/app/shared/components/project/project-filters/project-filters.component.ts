import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
  styleUrl: './project-filters.component.scss'
})
export class ProjectFiltersComponent {
  @Input() showArchiveFilter: boolean = false;
  @Output() filtersChanged = new EventEmitter<FilterValues>();

  showFilters: boolean = false;
  selectedStatusFilter: string = 'all';
  selectedTypeFilter: string = 'all';
  selectedSortOrder: string = 'default';
  selectedArchiveFilter: string = 'active';

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onFilterChange(): void {
    const filters: FilterValues = {
      status: this.selectedStatusFilter,
      type: this.selectedTypeFilter,
      sortOrder: this.selectedSortOrder
    };

    if (this.showArchiveFilter) {
      filters.archived = this.selectedArchiveFilter;
    }

    this.filtersChanged.emit(filters);
  }
}

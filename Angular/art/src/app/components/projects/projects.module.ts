import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectCardComponent } from 'src/app/shared/components/project/project-card/project-card.component';
import { ProjectFiltersComponent } from 'src/app/shared/components/project/project-filters/project-filters.component';


@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule,
    ProjectCardComponent,
    ProjectFiltersComponent
]
})
export class ProjectsModule { }

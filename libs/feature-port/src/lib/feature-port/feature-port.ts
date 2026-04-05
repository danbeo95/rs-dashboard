import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiPageLayout } from '@angular-nx-workspace/ui-page-layout';
import { DataAccessService, Port } from '@angular-nx-workspace/data-access';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-feature-port',
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule, UiPageLayout, RouterLink],
  templateUrl: './feature-port.html',
  styleUrl: './feature-port.css',
})
export class FeaturePort implements OnInit {
  private dataAccess = inject(DataAccessService);

  displayedColumns = [
    'name', 'country', 'numberOfTerminals',
    'numberOfBerths', 'emissionsRating', 'vesselCalls', 'tugboatJobs'
  ];

  ports = signal<Port[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.dataAccess.getPorts().subscribe({
      next: data => {
        this.ports.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}

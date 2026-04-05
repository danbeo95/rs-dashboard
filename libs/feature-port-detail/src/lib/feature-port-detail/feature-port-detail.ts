import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { UiPageLayout } from '@angular-nx-workspace/ui-page-layout';
import { Port, DataAccessService, VesselVoyage } from '@angular-nx-workspace/data-access';
import { calculateAverageStayDays } from './helper';

@Component({
  selector: 'lib-feature-port-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    UiPageLayout,
    RouterLink,
  ],
  templateUrl: './feature-port-detail.html',
  styleUrl: './feature-port-detail.css',
})
export class FeaturePortDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private dataAccess = inject(DataAccessService);

  port = signal<Port | null>(null);
  vesselVoyages = signal<VesselVoyage[]>([]);

  isPortLoading = signal(true);
  isVoyagesLoading = signal(true);

  portError = signal<string | null>(null);
  voyagesError = signal<string | null>(null);

  voyageColumns = [
    'vesselName',
    'vesselImo',
    'vesselType',
    'vesselAge',
    'portArrivalDate',
    'portDepatureDate',
  ];

  averageStayDays = computed(() => calculateAverageStayDays(this.vesselVoyages()));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchPort(id);
      this.fetchVoyages(id);
    } else {
      this.isPortLoading.set(false);
      this.isVoyagesLoading.set(false);
      this.portError.set('No port ID provided.');
    }
  }

  private fetchPort(id: string) {
    this.dataAccess.getPortById(id).subscribe({
      next: (data) => {
        this.port.set(data);
        this.isPortLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching port:', err);
        this.portError.set('Failed to load port details.');
        this.isPortLoading.set(false);
      },
    });
  }

  private fetchVoyages(id: string) {
    this.dataAccess.getVesselVoyage().subscribe({
      next: (voyages) => {
        const filteredVoyages = voyages.filter((v) => v.portId === Number(id));
        this.vesselVoyages.set(filteredVoyages);
        this.isVoyagesLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching voyages:', err);
        this.voyagesError.set('Failed to load vessel voyages.');
        this.isVoyagesLoading.set(false);
      },
    });
  }
}

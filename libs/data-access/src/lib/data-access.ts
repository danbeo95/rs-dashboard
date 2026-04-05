import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Port } from './models/port.model';
import { VesselVoyage } from './models/vessel-voyage.model';

@Injectable({ providedIn: 'root' })
export class DataAccessService {
  private http = inject(HttpClient);
  private baseUrl = 'https://6698c1a72069c438cd6fd6e7.mockapi.io/api/v1';

  getPorts(): Observable<Port[]> {
    return this.http.get<Port[]>(`${this.baseUrl}/ports`);
  }

  getPortById(id: string): Observable<Port> {
    return this.http.get<Port>(`${this.baseUrl}/ports/${id}`);
  }

  getVesselVoyage(): Observable<VesselVoyage[]> {
    return this.http.get<VesselVoyage[]>(`${this.baseUrl}/vessel-voyage`);
  }
}

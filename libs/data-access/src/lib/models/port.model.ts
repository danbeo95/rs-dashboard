export interface Port {
  id: number;
  name: string;
  description: string;
  country: string;
  numberOfTerminals: number;
  numberOfBerths: number;
  emissionsRating: string;
  vesselCalls: number;
  tugboatJobs: number;
}

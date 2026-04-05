import { VesselVoyage } from '@angular-nx-workspace/data-access';

export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function calculateAverageStayDays(voyages: VesselVoyage[]): number {
  if (voyages.length === 0) return 0;

  const totalDays = voyages.reduce((acc, v) => {
    const arrival = parseDate(v.portArrivalDate);
    const departure = parseDate(v.portDepatureDate);
    const diffTime = Math.abs(departure.getTime() - arrival.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return acc + diffDays;
  }, 0);

  return Math.round(totalDays / voyages.length);
}
